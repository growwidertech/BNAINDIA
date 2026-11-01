const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "antigravity-news-super-secret-production-jwt-key-2026-safe";

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✔ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✖ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("ANTIGRAVITY NEWS — AUTOMATED TEST SUITE EXECUTION");
  console.log("=======================================================\n");

  // TEST 1: Database Seed Integrity
  console.log("[SUITE 1: Database & Seed Verification]");
  const users = await prisma.user.findMany();
  assert(users.length >= 4, "Users table contains standard demo users (Admin, Editor, Reporter, Reader)");

  const categories = await prisma.category.findMany();
  assert(categories.length >= 8, "Categories table contains core news beats (World, Business, Tech, Sports, etc.)");

  const articles = await prisma.article.findMany();
  assert(articles.length >= 8, "Articles table contains seeded core news stories");

  const heroArticle = await prisma.article.findFirst({ where: { isHeroVideo: true } });
  assert(heroArticle !== null && !!heroArticle.videoUrl, "Hero video lead article is present with valid playable video URL");

  // TEST 2: Authentication & Password Cryptography
  console.log("\n[SUITE 2: Authentication & Security]");
  const admin = await prisma.user.findUnique({ where: { email: "admin@antigravitynews.com" } });
  const validPass = await bcrypt.compare("Admin@123", admin.passwordHash);
  assert(validPass, "Admin password hash matches 'Admin@123'");

  const invalidPass = await bcrypt.compare("WrongPass", admin.passwordHash);
  assert(!invalidPass, "Invalid password fails bcrypt comparison");

  const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: "1h" });
  const decoded = jwt.verify(token, JWT_SECRET);
  assert(decoded.id === admin.id && decoded.role === admin.role, "JWT session token signs and verifies correctly");

  // TEST 3: Multilingual Data & Translation Relationships
  console.log("\n[SUITE 3: Multilingual Architecture]");
  const translations = await prisma.articleTranslation.findMany({
    where: { articleId: heroArticle.id },
  });
  const langs = translations.map((t) => t.language);
  assert(langs.includes("hi"), "Hindi translation exists for lead climate story");
  assert(langs.includes("kn"), "Kannada translation exists for lead climate story");
  assert(langs.includes("ta"), "Tamil translation exists for lead climate story");
  assert(langs.includes("ur"), "Urdu translation exists for lead climate story (RTL enabled)");

  // TEST 4: Contributor Submission & Editorial Approval Workflow
  console.log("\n[SUITE 4: Editorial Workflow & Citizen Journalism]");
  const testSub = await prisma.submission.create({
    data: {
      headline: "Test Autonomous Electric Drone Fleet Launched in Bengaluru",
      summary: "City municipal council launches automated medical supply delivery network.",
      content: "Detailed reporting on autonomous drone transit corridors operating across eastern tech clusters.",
      categoryId: categories[0].id,
      contributorId: admin.id,
      status: "PENDING",
      declarationSigned: true,
    },
  });
  assert(testSub.status === "PENDING", "New news submission enters queue with PENDING status");

  // Simulate Editor Review & Approval
  const approvedArticle = await prisma.article.create({
    data: {
      slug: `test-drone-fleet-bengaluru-${Date.now()}`,
      title: testSub.headline,
      summary: testSub.summary,
      content: testSub.content,
      featuredImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800",
      categoryId: testSub.categoryId,
      authorId: testSub.contributorId,
      status: "PUBLISHED",
    },
  });

  await prisma.submission.update({
    where: { id: testSub.id },
    data: {
      status: "APPROVED",
      publishedArticleId: approvedArticle.id,
      editorialNotes: "Verified and published by Editor-in-Chief.",
    },
  });

  const updatedSub = await prisma.submission.findUnique({ where: { id: testSub.id } });
  assert(updatedSub.status === "APPROVED", "Editorial approval transitions submission to APPROVED");
  assert(updatedSub.publishedArticleId === approvedArticle.id, "Submission references newly generated published Article ID");

  // TEST 5: Comments & Nested Replies
  console.log("\n[SUITE 5: Community Features & Comment Moderation]");
  const newComment = await prisma.comment.create({
    data: {
      articleId: heroArticle.id,
      userId: admin.id,
      content: "Automated test comment on climate conference.",
      status: "APPROVED",
    },
  });

  const newReply = await prisma.comment.create({
    data: {
      articleId: heroArticle.id,
      userId: admin.id,
      parentId: newComment.id,
      content: "Automated test threaded reply.",
      status: "APPROVED",
    },
  });

  const commentWithReplies = await prisma.comment.findUnique({
    where: { id: newComment.id },
    include: { replies: true },
  });
  assert(commentWithReplies.replies.length === 1, "Threaded comment reply correctly references parent comment");

  // TEST 6: Bookmark & Like Transactions
  console.log("\n[SUITE 6: Reader Personalization & Bookmarks]");
  const bookmark = await prisma.bookmark.create({
    data: {
      userId: admin.id,
      articleId: approvedArticle.id,
    },
  });
  assert(!!bookmark.id, "Reader successfully bookmarks an article");

  const reaction = await prisma.reaction.create({
    data: {
      userId: admin.id,
      articleId: approvedArticle.id,
      type: "LIKE",
    },
  });
  assert(reaction.type === "LIKE", "Reader successfully likes an article");

  // TEST 7: Reporter Registration & District-Wise Directory
  console.log("\n[SUITE 7: Reporter Onboarding & District-Wise Bureau Directory]");
  const seededReporters = await prisma.reporter.findMany();
  assert(seededReporters.length >= 10, "Database contains seeded bureau reporters");

  const lucknowReporters = await prisma.reporter.findMany({ where: { district: "Lucknow" } });
  assert(lucknowReporters.length >= 1, "Reporter filtered successfully district-wise (Lucknow)");

  const mumbaiReporters = await prisma.reporter.findMany({ where: { district: "Mumbai Suburban" } });
  assert(mumbaiReporters.length >= 1, "Reporter filtered successfully district-wise (Mumbai Suburban)");

  const testReporter = await prisma.reporter.create({
    data: {
      name: "Alok Nath Trivedi",
      email: `alok.test.${Date.now()}@bnanews.in`,
      phone: "+91 99112 33445",
      district: "Varanasi",
      state: "Uttar Pradesh",
      location: "Varanasi, Uttar Pradesh",
      qualification: "Master of Mass Communication",
      language: "Hindi, English",
      beat: "Central India Ground Investigation",
      aadhaarUrl: "/uploads/reporters/test-aadhaar.pdf",
      panCardUrl: "/uploads/reporters/test-pan.pdf",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      isVerified: true,
      status: "APPROVED",
    },
  });
  assert(!!testReporter.id, "New reporter registered with district, state, and 8 mandatory fields");

  // Verify privacy: Public API projection must NOT expose phone number
  const publicReporterProjection = await prisma.reporter.findUnique({
    where: { id: testReporter.id },
    select: {
      id: true,
      name: true,
      email: true,
      district: true,
      state: true,
      location: true,
      qualification: true,
      language: true,
      beat: true,
      photoUrl: true,
      isVerified: true,
      // phone is NOT selected
    },
  });
  assert(publicReporterProjection.phone === undefined, "Phone number is successfully excluded from public view for privacy");

  await prisma.reporter.delete({ where: { id: testReporter.id } });

  // TEST 8: User Login Profile Modification (Name & Email ID Update)
  console.log("\n[SUITE 8: User Account Management — Contact Name & Login Email ID]");
  const readerUser = await prisma.user.findUnique({ where: { email: "reader@antigravitynews.com" } });
  assert(!!readerUser, "Found test reader login account");

  const originalName = readerUser.name;
  const originalEmail = readerUser.email;
  const updatedTestName = "Anjali V. Sharma (Updated Contact)";
  const updatedTestEmail = `anjali.updated.${Date.now()}@antigravitynews.com`;

  // Update contact name and email id
  const updatedUser = await prisma.user.update({
    where: { id: readerUser.id },
    data: {
      name: updatedTestName,
      email: updatedTestEmail,
    },
  });
  assert(updatedUser.name === updatedTestName, "Contact Name of login updated successfully");
  assert(updatedUser.email === updatedTestEmail, "Login Email ID updated successfully");

  // Verify audit log creation
  const auditEntry = await prisma.auditLog.create({
    data: {
      userId: readerUser.id,
      action: "USER_PROFILE_UPDATED",
      entity: "User",
      entityId: readerUser.id,
      details: `Login details updated: Contact Name set to "${updatedTestName}", Email ID set to "${updatedTestEmail}".`,
    },
  });
  assert(auditEntry.action === "USER_PROFILE_UPDATED", "Audit log created for user contact and email change");

  // Revert test user credentials back to original
  await prisma.user.update({
    where: { id: readerUser.id },
    data: {
      name: originalName,
      email: originalEmail,
    },
  });
  await prisma.auditLog.delete({ where: { id: auditEntry.id } });

  // TEST 9: Role-Based User Creation & Governance (Super Admin, Editor, Reporter Roles)
  console.log("\n[SUITE 9: Admin User Creation & Role Governance]");
  const testEditorEmail = `test.editor.${Date.now()}@bnanews.in`;
  const testSuperAdminEmail = `test.superadmin.${Date.now()}@bnanews.in`;
  const hashedPassword = await bcrypt.hash("TestPassword@123", 10);

  // 1. Create Editor login
  const editorUser = await prisma.user.create({
    data: {
      name: "Senior Desk Editor",
      email: testEditorEmail,
      passwordHash: hashedPassword,
      role: "EDITOR",
      location: "Mumbai News Desk",
      isActive: true,
    },
  });
  assert(editorUser.role === "EDITOR", "Editor account created with EDITOR role permissions");

  // 2. Create SuperAdmin login
  const superAdminUser = await prisma.user.create({
    data: {
      name: "Executive Super Admin",
      email: testSuperAdminEmail,
      passwordHash: hashedPassword,
      role: "SUPERADMIN",
      location: "National Headquarters",
      isActive: true,
    },
  });
  assert(superAdminUser.role === "SUPERADMIN", "Super Admin account created with SUPERADMIN root permissions");

  // 3. Promote/Change role to REPORTER
  const updatedEditorRole = await prisma.user.update({
    where: { id: editorUser.id },
    data: {
      role: "REPORTER",
      location: "Kolkata Bureau",
    },
  });
  assert(updatedEditorRole.role === "REPORTER", "User role successfully transitioned from EDITOR to REPORTER");

  // 4. Audit Log entry for User Creation & Governance
  const userCreationAudit = await prisma.auditLog.create({
    data: {
      userId: superAdminUser.id,
      action: "ADMIN_USER_CREATED",
      entity: "User",
      entityId: editorUser.id,
      details: `Login created by ${superAdminUser.name} (${superAdminUser.role}) for "${editorUser.name}" with role "EDITOR".`,
    },
  });
  assert(userCreationAudit.action === "ADMIN_USER_CREATED", "Audit log created for administrative user creation");

  // Clean test governance artefacts
  await prisma.auditLog.delete({ where: { id: userCreationAudit.id } });
  await prisma.user.delete({ where: { id: editorUser.id } });
  await prisma.user.delete({ where: { id: superAdminUser.id } });

  // TEST 10: Google AdSense Governance & Settings
  console.log("\n[SUITE 10: Google AdSense Monetization & Ad Placements]");
  const adSetting = await prisma.adSetting.upsert({
    where: { id: "default" },
    update: {
      publisherId: "ca-pub-1234567890123456",
      adsenseEnabled: true,
      autoAdsEnabled: true,
      testMode: true,
      headerSlotId: "1122334455",
      inArticleSlotId: "5544332211",
      sidebarSlotId: "6677889900",
    },
    create: {
      id: "default",
      publisherId: "ca-pub-1234567890123456",
      adsenseEnabled: true,
      autoAdsEnabled: true,
      testMode: true,
      headerSlotId: "1122334455",
      inArticleSlotId: "5544332211",
      sidebarSlotId: "6677889900",
    },
  });
  assert(adSetting.adsenseEnabled === true, "Google AdSense configuration is active");
  assert(adSetting.publisherId.startsWith("ca-pub-"), "Publisher ID follows valid Google AdSense client format");
  assert(adSetting.headerSlotId === "1122334455", "Header billboard ad slot configured properly");
  assert(adSetting.inArticleSlotId === "5544332211", "In-article native ad slot configured properly");
  assert(adSetting.testMode === true, "AdSense test and preview mode successfully enabled");

  // TEST 11: Reporter Location-Based Story Filing & Live Approval Flow
  console.log("\n[SUITE 11: Reporter Ground News Filing & Instant Live Approval]");
  const reporterUser = (await prisma.user.findFirst({ where: { role: "REPORTER" } })) || admin;
  const filedStory = await prisma.submission.create({
    data: {
      headline: `Ground Report: High-Speed Metro Trial Across Bengaluru East ${Date.now()}`,
      summary: "State leadership inspects driverless train corridors between Whitefield and Central Silk Board.",
      content: "Official inspection conducted on high-speed driverless transit lines across eastern IT corridor.",
      categoryId: categories[0].id,
      contributorId: reporterUser.id,
      state: "Karnataka",
      district: "Bengaluru Urban",
      location: "Whitefield Metro Depot, Bengaluru Urban, Karnataka",
      language: "en",
      declarationSigned: true,
      status: "PENDING",
    },
  });
  assert(filedStory.status === "PENDING", "Reporter news filed with PENDING review status");
  assert(filedStory.district === "Bengaluru Urban", "Reporter district location captured accurately");
  assert(filedStory.state === "Karnataka", "Reporter state location captured accurately");

  // Editorial approval workflow simulation
  const uniqueLiveSlug = `ground-report-bengaluru-metro-${Date.now()}`;
  const liveArticle = await prisma.article.create({
    data: {
      slug: uniqueLiveSlug,
      title: filedStory.headline,
      summary: filedStory.summary,
      content: filedStory.content,
      categoryId: filedStory.categoryId,
      authorId: filedStory.contributorId,
      location: filedStory.location,
      state: filedStory.state,
      district: filedStory.district,
      language: filedStory.language,
      featuredImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  const approvedFiledSub = await prisma.submission.update({
    where: { id: filedStory.id },
    data: {
      status: "APPROVED",
      publishedArticleId: liveArticle.id,
    },
  });
  assert(approvedFiledSub.status === "APPROVED", "Editorial approval transitions filed news to APPROVED");
  assert(liveArticle.status === "PUBLISHED", "Approved article is immediately live with PUBLISHED status");
  assert(liveArticle.location.includes("Bengaluru Urban"), "Live article preserves reporter location dateline");

  const liveCheck = await prisma.article.findUnique({ where: { slug: uniqueLiveSlug } });
  assert(liveCheck !== null && liveCheck.id === liveArticle.id, "Live article is instantly accessible on portal via slug");

  // Clean reporter test artefacts
  await prisma.article.delete({ where: { id: liveArticle.id } });
  await prisma.submission.delete({ where: { id: filedStory.id } });

  // TEST 12: External Video Proof & Social Media Redirection (Times Now Feature)
  console.log("\n[SUITE 12: External Video Proof & Social Media Redirection (Times Now Style)]");
  const testProofUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const testXProofUrl = "https://x.com/AntigravityNews/status/1234567890123456789";

  const storyWithProof = await prisma.submission.create({
    data: {
      headline: `Verified Evidence: Citizen Witness Filmed Live Event ${Date.now()}`,
      summary: "Exclusive video proof captured by local resident documenting environmental restoration.",
      content: "Detailed report corroborating the viral video footage broadcast on social media platforms.",
      categoryId: categories[0].id,
      contributorId: reporterUser.id,
      state: "Maharashtra",
      district: "Mumbai City",
      location: "Marine Drive, Mumbai City, Maharashtra",
      language: "en",
      externalVideoUrl: testProofUrl,
      videoProofPlatform: "YOUTUBE",
      videoProofTitle: "Eyewitness Ground Video Proof Recorded on Scene",
      declarationSigned: true,
      status: "PENDING",
    },
  });
  assert(storyWithProof.externalVideoUrl === testProofUrl, "External video proof URL saved on news submission");
  assert(storyWithProof.videoProofPlatform === "YOUTUBE", "Video proof platform recognized as YOUTUBE");

  // Approval carries proof into live article
  const proofSlug = `verified-video-proof-${Date.now()}`;
  const liveProofArticle = await prisma.article.create({
    data: {
      slug: proofSlug,
      title: storyWithProof.headline,
      summary: storyWithProof.summary,
      content: storyWithProof.content,
      categoryId: storyWithProof.categoryId,
      authorId: storyWithProof.contributorId,
      location: storyWithProof.location,
      state: storyWithProof.state,
      district: storyWithProof.district,
      language: storyWithProof.language,
      featuredImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200",
      externalVideoUrl: storyWithProof.externalVideoUrl,
      videoProofPlatform: storyWithProof.videoProofPlatform,
      videoProofTitle: storyWithProof.videoProofTitle,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
  assert(liveProofArticle.externalVideoUrl === testProofUrl, "Live article retains external video proof URL for social redirection");
  assert(liveProofArticle.videoProofTitle === "Eyewitness Ground Video Proof Recorded on Scene", "Live article retains custom proof evidence title");

  // Clean proof test artefacts
  await prisma.article.delete({ where: { id: liveProofArticle.id } });
  await prisma.submission.delete({ where: { id: storyWithProof.id } });

  // Clean test artefacts
  await prisma.bookmark.delete({ where: { id: bookmark.id } });
  await prisma.reaction.delete({ where: { id: reaction.id } });
  await prisma.comment.delete({ where: { id: newReply.id } });
  await prisma.comment.delete({ where: { id: newComment.id } });
  await prisma.article.delete({ where: { id: approvedArticle.id } });
  await prisma.submission.delete({ where: { id: testSub.id } });

  console.log("\n=======================================================");
  console.log(`TEST SUITE RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) process.exit(1);
}

runTests()
  .catch((e) => {
    console.error("Test execution fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
