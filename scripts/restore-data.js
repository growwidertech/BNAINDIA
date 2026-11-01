const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function restoreData() {
  const backupFile = path.join(__dirname, "..", "prisma", "backup-data.json");
  if (!fs.existsSync(backupFile)) {
    console.error(`Backup file not found at: ${backupFile}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(backupFile, "utf8"));
  console.log(`Restoring database backup from ${data.exportDate}...`);

  // 1. Users
  for (const u of data.users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: u,
      create: u,
    });
  }
  console.log(`✓ Restored ${data.users.length} users`);

  // 2. Categories
  for (const c of data.categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log(`✓ Restored ${data.categories.length} categories`);

  // 3. Articles
  for (const a of data.articles) {
    await prisma.article.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }
  console.log(`✓ Restored ${data.articles.length} articles`);

  // 4. Translations
  for (const t of data.articleTranslations) {
    await prisma.articleTranslation.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`✓ Restored ${data.articleTranslations.length} translations`);

  // 5. Reporters
  for (const r of data.reporters) {
    await prisma.reporter.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }
  console.log(`✓ Restored ${data.reporters.length} reporters`);

  // 6. Submissions
  for (const s of data.submissions) {
    await prisma.submission.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`✓ Restored ${data.submissions.length} submissions`);

  // 7. AdSettings
  for (const ad of data.adSettings) {
    await prisma.adSetting.upsert({
      where: { id: ad.id },
      update: ad,
      create: ad,
    });
  }
  console.log(`✓ Restored ${data.adSettings.length} ad settings`);

  console.log("\nDatabase restoration completed successfully!");
  process.exit(0);
}

restoreData().catch((err) => {
  console.error("Restoration error:", err);
  process.exit(1);
});
