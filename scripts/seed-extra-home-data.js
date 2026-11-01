const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedExtra() {
  console.log("Seeding extra rich articles for homepage detailing...");

  const admin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  const indiaCat = await prisma.category.findUnique({ where: { slug: "india" } });
  const techCat = await prisma.category.findUnique({ where: { slug: "technology" } });
  const scienceCat = await prisma.category.findUnique({ where: { slug: "science" } });
  const businessCat = await prisma.category.findUnique({ where: { slug: "business" } });

  const extraArticles = [
    {
      slug: "delhi-ncr-urban-forestry-corridor-air-pollution",
      title: "Delhi NCR: 50-Kilometer Urban Bio-Shield Corridor Inaugurated Along Ring Road",
      summary: "State environmental ministry flags off dense indigenous tree plantation with automated misting towers to curb particulate spikes ahead of winter.",
      content: "The National Capital Territory administration has unveiled a landmark 50-kilometer bio-shield corridor along key arterial transit routes in New Delhi.\n\nFeaturing dense native species and automated solar-powered misting arrays, the initiative targets a 25% reduction in localized PM2.5 concentrations.",
      categoryId: indiaCat.id,
      authorId: admin.id,
      language: "en",
      location: "Central Ridge, New Delhi, Delhi (NCT)",
      district: "New Delhi",
      state: "Delhi (NCT)",
      featuredImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80",
      externalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoProofPlatform: "YOUTUBE",
      videoProofTitle: "Aerial Drone Survey of New Delhi Bio-Shield Corridor",
      sourceAttribution: "Delhi State Environment Council & Ground Eyewitnesses",
      readingTimeMin: 4,
      isTrending: true,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    },
    {
      slug: "bengaluru-east-ai-adaptive-traffic-grid",
      title: "Bengaluru Tech Hub: AI-Driven Adaptive Traffic Control Slashes Commute Delays by 32%",
      summary: "Municipal body deploys real-time computer vision sensors across 140 arterial intersections from Whitefield to Electronic City.",
      content: "Commuters across eastern Bengaluru experienced smoother transit today as the civic administration activated its synchronized AI traffic grid.\n\nBy processing vehicle velocity metrics in real-time, the system dynamically balances green corridor durations.",
      categoryId: techCat.id,
      authorId: admin.id,
      language: "en",
      location: "Whitefield, Bengaluru Urban, Karnataka",
      district: "Bengaluru Urban",
      state: "Karnataka",
      featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
      externalVideoUrl: "https://x.com/AntigravityNews/status/1793545338060",
      videoProofPlatform: "TWITTER_X",
      videoProofTitle: "Traffic Control Room Live CCTV Demonstration on X",
      sourceAttribution: "Bengaluru Traffic Police Operations Center",
      readingTimeMin: 3,
      isFeatured: true,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
    },
    {
      slug: "lucknow-gomti-riverfront-conservation-phase-2",
      title: "Lucknow: Heritage Gomti Riverfront Eco-Restoration Phase 2 Completed Ahead of Schedule",
      summary: "State water resources department restores 12 km riparian marshland corridor with biological wetlands and solar aeration fountains.",
      content: "The iconic Gomti Riverfront in Lucknow has received a major ecological boost with the completion of Phase 2 restoration works.\n\nBiochemists and civil engineers have revitalized the natural wetland floodplains, boosting native avian biodiversity.",
      categoryId: indiaCat.id,
      authorId: admin.id,
      language: "en",
      location: "Hazratganj, Lucknow, Uttar Pradesh",
      district: "Lucknow",
      state: "Uttar Pradesh",
      featuredImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80",
      sourceAttribution: "UP State Irrigation and Water Resources Bureau",
      readingTimeMin: 3,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 3600000 * 6), // 6 hours ago
    },
    {
      slug: "chennai-tidal-energy-coastal-desalination-pilot",
      title: "Chennai Coast: India's First Modular Tidal Micro-Generator Powers Coastal Desalination Facility",
      summary: "National Institute of Ocean Technology commissions coastal kinetic wave turbine producing 500,000 liters of potable water daily.",
      content: "In a groundbreaking clean-tech milestone, maritime researchers off the coast of Chennai have successfully synchronized a modular tidal turbine with a zero-emission reverse osmosis facility.",
      categoryId: scienceCat.id,
      authorId: admin.id,
      language: "en",
      location: "Marina Coastline, Chennai, Tamil Nadu",
      district: "Chennai",
      state: "Tamil Nadu",
      featuredImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&auto=format&fit=crop&q=80",
      externalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoProofPlatform: "YOUTUBE",
      videoProofTitle: "Underwater Turbine Operational Footage Released by NIOT",
      sourceAttribution: "National Institute of Ocean Technology",
      readingTimeMin: 4,
      isTrending: true,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 3600000 * 8), // 8 hours ago
    },
  ];

  for (const item of extraArticles) {
    const existing = await prisma.article.findUnique({ where: { slug: item.slug } });
    if (!existing) {
      await prisma.article.create({ data: item });
      console.log(`  + Created article: ${item.title}`);
    } else {
      console.log(`  = Already exists: ${item.title}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seedExtra().catch((e) => {
  console.error("Seeding error:", e);
  process.exit(1);
});
