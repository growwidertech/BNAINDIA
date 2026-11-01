const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function exportAllData() {
  console.log("Exporting all database records for complete website backup...");

  const data = {
    exportDate: new Date().toISOString(),
    version: "1.0.0",
    platform: "ANTIGRAVITY NEWS (BNA) - COMPLETE MULTILINGUAL DIGITAL NEWS PLATFORM",
    users: await prisma.user.findMany(),
    categories: await prisma.category.findMany(),
    articles: await prisma.article.findMany(),
    articleTranslations: await prisma.articleTranslation.findMany(),
    articleRevisions: await prisma.articleRevision.findMany(),
    submissions: await prisma.submission.findMany(),
    reporters: await prisma.reporter.findMany(),
    adSettings: await prisma.adSetting.findMany(),
    comments: await prisma.comment.findMany(),
    bookmarks: await prisma.bookmark.findMany(),
    reactions: await prisma.reaction.findMany(),
    auditLogs: await prisma.auditLog.findMany(),
  };

  const backupPath = path.join(__dirname, "..", "prisma", "backup-data.json");
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf8");

  console.log(`Successfully exported data to: ${backupPath}`);
  console.log(`- Users: ${data.users.length}`);
  console.log(`- Categories: ${data.categories.length}`);
  console.log(`- Articles: ${data.articles.length}`);
  console.log(`- Reporters: ${data.reporters.length}`);
  console.log(`- Submissions: ${data.submissions.length}`);
  console.log(`- Ad Settings: ${data.adSettings.length}`);

  process.exit(0);
}

exportAllData().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
