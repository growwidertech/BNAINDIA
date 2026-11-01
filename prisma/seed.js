const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Antigravity News database...");

  // Clean existing data for clean seed
  await prisma.commentReport.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.reaction.deleteMany({});
  await prisma.articleRevision.deleteMany({});
  await prisma.articleTranslation.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.notification.deleteMany({});

  // 1. Create Users
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const editorPassword = await bcrypt.hash("Editor@123", 10);
  const reporterPassword = await bcrypt.hash("Reporter@123", 10);
  const readerPassword = await bcrypt.hash("Reader@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Vikramaditya Sharma",
      email: "admin@antigravitynews.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bio: "Editor-in-Chief & Senior Director, Antigravity News Agency.",
      location: "New Delhi, India",
    },
  });

  const editor = await prisma.user.create({
    data: {
      name: "Priya Sundaram",
      email: "editor@antigravitynews.com",
      passwordHash: editorPassword,
      role: "EDITOR",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bio: "Executive Editor - National & Geopolitical Affairs.",
      location: "Bengaluru, India",
    },
  });

  const reporter = await prisma.user.create({
    data: {
      name: "Arjun Nair",
      email: "reporter@antigravitynews.com",
      passwordHash: reporterPassword,
      role: "CONTRIBUTOR",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      bio: "Investigative Contributor covering Science, Tech & Climate.",
      location: "Mumbai, India",
    },
  });

  const reader = await prisma.user.create({
    data: {
      name: "Aanya Verma",
      email: "reader@antigravitynews.com",
      passwordHash: readerPassword,
      role: "READER",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      bio: "Voracious reader, cricket aficionado and economics researcher.",
      location: "Hyderabad, India",
    },
  });

  console.log("Users created successfully.");

  // 2. Create Categories
  const categoriesData = [
    { slug: "world", name: "World", description: "Global events, diplomacy, geopolitics and international affairs", order: 1, color: "#1d4ed8" },
    { slug: "business", name: "Business", description: "Markets, corporate developments, economy and fintech", order: 2, color: "#047857" },
    { slug: "technology", name: "Technology", description: "Innovation, artificial intelligence, gadgets and digital transformation", order: 3, color: "#7c3aed" },
    { slug: "sports", name: "Sports", description: "Live scores, match reports, tournaments and athlete chronicles", order: 4, color: "#ea580c" },
    { slug: "entertainment", name: "Entertainment", description: "Cinema, celebrity interviews, arts and streaming culture", order: 5, color: "#db2777" },
    { slug: "health", name: "Health", description: "Medical research, wellness, public healthcare and nutrition", order: 6, color: "#059669" },
    { slug: "lifestyle", name: "Lifestyle", description: "Culture, travel destinations, culinary arts and living", order: 7, color: "#d97706" },
    { slug: "science", name: "Science", description: "Space exploration, physics, deep tech discoveries and cosmology", order: 8, color: "#4f46e5" },
    { slug: "india", name: "India", description: "National policy, states, parliament and governance", order: 9, color: "#b91c1c" },
    { slug: "opinion", name: "Opinion", description: "Editorials, guest columns and deep-dive analytical viewpoints", order: 10, color: "#334155" },
  ];

  const catMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        order: cat.order,
        color: cat.color,
      },
    });
    catMap[cat.slug] = created.id;
  }

  console.log("Categories created.");

  // Sample HTML5 playable test videos (standard public MP4s with reliable CDNs)
  const videoUrl1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const videoUrl2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // 3. Create Articles
  const articles = [
    {
      slug: "global-leaders-unite-for-greener-tomorrow-climate-summit",
      title: "Global Leaders Unite for a Greener Tomorrow at Landmark Climate Summit",
      summary: "World leaders from 190 countries commit to faster action on climate change, establishing a $500B clean energy fund and binding emissions milestones.",
      content: `In a historic summit held today, representatives and heads of state from over 190 nations reached a landmark consensus to accelerate the global transition towards renewable energy. The new accord guarantees more than $500 billion in targeted financing for developing nations, with special focus on resilient agricultural systems, grid modernization, and distributed solar installations.

United Nations delegates lauded the collaborative spirit of the negotiations, underscoring that time is of the essence as extreme weather occurrences intensify worldwide.

"We are not merely committing numbers to paper; we are charting an irreversible pathway toward ecological balance," stated the chief plenary rapporteur during the closing address. "The global south will lead the leap into solar, wind, and green hydrogen."

Key summit takeaways include:
- A binding timeline for phasing out inefficient fossil fuel subsidies by 2030.
- Multilateral guarantees for sovereign green bonds issued by developing economies.
- Launch of the Global Clean Energy Grid initiative connecting regional power markets across Asia and Europe.
- Direct funding allocations for community-scale sea wall defenses and drought-resistant seed banks.

The Indian delegation highlighted India's rapid expansion of non-fossil installed capacity, now outpacing national targets ahead of schedule, setting an example for equitable technological transfer.`,
      featuredImage: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80",
      videoUrl: videoUrl1,
      videoDuration: "02:36",
      caption: "Panoramic skyline illuminated as summit delegates conclude historic evening negotiations.",
      categoryId: catMap["world"],
      authorId: editor.id,
      language: "en",
      isBreaking: true,
      isFeatured: true,
      isTrending: true,
      isHeroVideo: true,
      readingTimeMin: 4,
      viewsCount: 14200,
      likesCount: 842,
    },
    {
      slug: "stock-markets-record-highs-positive-economic-indicators",
      title: "Stock Markets Surge to Fresh Highs Amid Strong Macro Indicators and Corporate Earnings",
      summary: "Global markets and Indian indices rose today after better-than-expected manufacturing data and robust quarterly corporate earnings boosted investor sentiment.",
      content: `Equity markets worldwide experienced vigorous buying across sectors today, propelled by robust macro data, easing inflation prints, and standout corporate earnings reports. Domestic benchmark indices posted their biggest single-day point advance in four months.

Foreign institutional investors poured net capital into blue-chip technology, banking, and capital goods counters, as sovereign bond yields moderated following dovish central bank signals.

Market strategists attribute the current bull run to:
1. Resilient consumer demand across festive retail sectors.
2. Capex revival spearheaded by infrastructure and industrial manufacturing.
3. Stable foreign exchange reserves providing a solid buffer against external volatilities.

"What we are seeing is fundamentally driven expansion," commented Rajesh Singhania, Chief Market Analyst at Horizon Securities. "Corporate balance sheets are cleaner than they have been in two decades, and capacity utilization numbers are ticking above 76%."`,
      featuredImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80",
      caption: "Financial district trading terminals reflect green indices across all major sectors.",
      categoryId: catMap["business"],
      authorId: admin.id,
      language: "en",
      isBreaking: false,
      isFeatured: true,
      isTrending: true,
      readingTimeMin: 3,
      viewsCount: 9840,
      likesCount: 421,
    },
    {
      slug: "india-clinch-t20-series-thrilling-final-over-finish",
      title: "Team India Clinch T20 Series in Thrilling Final Over Spectacle",
      summary: "A masterclass bowling performance in the death overs sealed an edge-of-the-seat 4-run victory in the decider before a capacity stadium.",
      content: `In an absolute nail-biter that swung like a pendulum until the final delivery, Team India captured the bilateral T20 international trophy with a sensational 4-run triumph.

Defending 188 on a pristine batting strip, the visitors appeared poised for victory needing just 12 runs from the final 12 deliveries with four wickets in hand. However, an exemplary display of reverse swing and pinpoint wide yorkers restricted the opposition to singles.

The player of the match remarked: "We knew keeping our composure was paramount. In high-pressure death overs, it's about executing your cleanest plan delivery after delivery without panic."

Stadium crowds erupted into euphoric celebrations as the final ball was steered safely into the gloves of the wicketkeeper, sealing a 3-2 series victory for the hosts.`,
      featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
      caption: "Indian team celebrates their hard-fought series victory on the podium.",
      categoryId: catMap["sports"],
      authorId: reporter.id,
      language: "en",
      isBreaking: false,
      isFeatured: true,
      isTrending: true,
      readingTimeMin: 3,
      viewsCount: 18500,
      likesCount: 1530,
    },
    {
      slug: "ai-advances-transform-healthcare-and-diagnostics",
      title: "AI Advances Set to Revolutionize Early Disease Detection Across Public Health Networks",
      summary: "Groundbreaking neural diagnostic models deployed in community clinics demonstrate 98% accuracy in identifying early-stage pulmonary and oncological markers.",
      content: `A pioneering artificial intelligence clinical diagnostic suite developed collaboratively by medical institutes and tech researchers is transforming preventive healthcare delivery.

The system, capable of screening high-resolution radiology scans and genomic profiles in under forty seconds, has shown an unprecedented 98.4% concordance with expert panel conclusions.

"Our objective is not to replace the clinician, but to give every community health worker the diagnostic acuity of an apex medical board," said Dr. Sunita Kulkarni, lead investigator. "In rural and semi-urban health centers where specialized radiologists are scarce, this tool saves critical months in oncology detection."

Pilot deployments across 120 district hospitals have already facilitated timely medical interventions for thousands of citizens.`,
      featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      caption: "Advanced neural visualization of diagnostic machine learning algorithms in action.",
      categoryId: catMap["technology"],
      authorId: editor.id,
      language: "en",
      isBreaking: false,
      isFeatured: true,
      isTrending: true,
      readingTimeMin: 4,
      viewsCount: 11200,
      likesCount: 680,
    },
    {
      slug: "isro-next-gen-earth-observation-satellite-constellation",
      title: "ISRO Readies Next-Generation Earth Observation Constellation for Precision Climate Tracking",
      summary: "State-of-the-art synthetic aperture radar satellites will provide hyper-spectral real-time monitoring of agricultural patterns, forest covers, and glacier recessions.",
      content: `The Indian Space Research Organisation (ISRO) is finalizing integration of its next-generation high-resolution Earth Observation satellite constellation scheduled for liftoff from the Satish Dhawan Space Centre.

Equipped with dual-band Synthetic Aperture Radar (SAR) capable of piercing heavy cloud cover and nocturnal obscurity, the orbital suite will transmit sub-meter resolution environmental telemetry every 12 hours.

Key applications include:
- Real-time flood inundation mapping and cyclone path prediction.
- Precision soil moisture telemetry assisting millions of farmers.
- Glacier melt surveillance across the Himalayan watershed.
- Urban development and coastal zone regulatory enforcement.

Scientists confirm that all ground receiver stations in Antarctica and nationwide telemetry nodes are operating in complete synchronization for launch readiness.`,
      featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      caption: "High-resolution orbital sensor rendering Earth's atmosphere and geographical topography.",
      categoryId: catMap["science"],
      authorId: reporter.id,
      language: "en",
      isBreaking: false,
      isFeatured: false,
      isTrending: true,
      readingTimeMin: 3,
      viewsCount: 8400,
      likesCount: 512,
    },
    {
      slug: "holistic-wellness-revolution-functional-nutrition",
      title: "The Functional Nutrition Renaissance: How Ancient Millets and Mindful Eating Are Transforming Modern Diets",
      summary: "Nutritionists and cardiologists highlight how indigenous superfoods like ragi, jowar, and cold-pressed botanical oils are reversing metabolic syndrome.",
      content: `In an era dominated by sedentary work schedules and ultra-processed convenience foods, a powerful movement toward functional, indigenous nutrition is taking root.

Clinical trials published this month demonstrate that incorporating ancient coarse grains into daily meals results in marked stabilization of post-prandial glycemic spikes and substantial improvements in cardiovascular lipid markers.

Dr. Ramesh Kothari, head of Integrative Medicine at Apollo Health, notes: "Our traditional culinary frameworks were inherently prebiotic and anti-inflammatory. Returning to minimally processed whole grains isn't nostalgia—it is sound biological science."

Consumers across metropolitan hubs are embracing cold-pressed seed oils, probiotic fermented preparations, and seasonal eating regimens with enthusiasm.`,
      featuredImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80",
      caption: "Organic farm-to-table grains and nutrient-dense culinary spreads.",
      categoryId: catMap["lifestyle"],
      authorId: admin.id,
      language: "en",
      isBreaking: false,
      isFeatured: false,
      isTrending: false,
      readingTimeMin: 3,
      viewsCount: 6200,
      likesCount: 390,
    },
    {
      slug: "indian-cinema-global-renaissance-box-office-mastery",
      title: "Indian Cinema's Global Renaissance: Visual Storytelling Conquers International Audiences",
      summary: "Original cinematic productions with deep cultural roots are commanding record box office receipts and critical praise across Europe, the Americas, and East Asia.",
      content: `The global reception of Indian cinematic epics and nuanced indie narratives has reached an all-time crescendo. Over the past twenty-four months, cross-cultural viewership on worldwide streaming channels and foreign theatrical distributions has expanded by over 140%.

Film scholars point to the uncompromising technical craftsmanship, soul-stirring musical scores, and authentically rooted emotional beats that resonate with international spectators seeking fresh cinematic horizons.

Major production studios are now co-producing multilingual projects engineered simultaneously for domestic cinema chains and global festival circuits, marking a prosperous new era of cultural diplomacy.`,
      featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
      caption: "Cinematic film rolls and stage lighting illuminating production soundstages.",
      categoryId: catMap["entertainment"],
      authorId: reporter.id,
      language: "en",
      isBreaking: false,
      isFeatured: false,
      isTrending: false,
      readingTimeMin: 4,
      viewsCount: 7100,
      likesCount: 440,
    },
    {
      slug: "sustainable-urban-mobility-electric-transit-corridors",
      title: "Electric Transit Corridors: How Major Metros Are Decarbonizing Commuter Lifelines",
      summary: "With over 4,000 new electric public buses and multimodal metro interchanges, Indian cities are setting global benchmarks in emissions-free rapid transit.",
      content: `State transport undertakings and urban development authorities have inaugurated six dedicated zero-emission transit corridors across metropolitan centers today.

By integrating automated feeder shuttle loops, smart tap-in transit cards, and solar-powered rapid-charging terminals at depot centers, public transport ridership has witnessed a 22% leap while diesel emissions have plummeted.

Urban planners emphasize that clean transit represents an essential civil right that alleviates congestion, enhances air quality indices, and fosters inclusive economic mobility.`,
      featuredImage: "https://images.unsplash.com/photo-1558441719-8b489c634a1b?w=1200&auto=format&fit=crop&q=80",
      caption: "Sleek electric public transit bus moving across modern urban overpass.",
      categoryId: catMap["india"],
      authorId: editor.id,
      language: "en",
      isBreaking: false,
      isFeatured: false,
      isTrending: false,
      readingTimeMin: 3,
      viewsCount: 5300,
      likesCount: 310,
    },
  ];

  const createdArticles = [];
  for (const art of articles) {
    const created = await prisma.article.create({
      data: art,
    });
    createdArticles.push(created);
  }

  console.log(`Created ${createdArticles.length} core articles.`);

  // 4. Create Multilingual Translations for Top Article (Hindi, Kannada, Tamil, Urdu, Bengali)
  const heroArticle = createdArticles[0];

  const translations = [
    {
      articleId: heroArticle.id,
      language: "hi",
      slug: "global-leaders-unite-for-greener-tomorrow-climate-summit-hi",
      title: "ऐतिहासिक जलवायु शिखर सम्मेलन में हरित भविष्य के लिए एकजुट हुए विश्व नेता",
      summary: "190 से अधिक देशों के नेताओं ने जलवायु परिवर्तन पर त्वरित कार्रवाई का संकल्प लिया, 500 अरब डॉलर के स्वच्छ ऊर्जा कोष की स्थापना की।",
      content: `आज आयोजित एक ऐतिहासिक शिखर सम्मेलन में 190 से अधिक देशों के राष्ट्राध्यक्षों और प्रतिनिधियों ने नवीकरणीय ऊर्जा की ओर वैश्विक संक्रमण को गति देने के लिए एक ऐतिहासिक सहमति बनाई।

यह नया समझौता विकासशील देशों के लिए 500 अरब डॉलर से अधिक का लक्षित वित्त पोषण सुनिश्चित करता है, जिसमें सौर ऊर्जा, पवन ऊर्जा और ग्रीन हाइड्रोजन पहलों पर विशेष ध्यान दिया गया है।

सम्मेलन के प्रमुख बिंदुओं में 2030 तक जीवाश्म ईंधन सब्सिडी को चरणबद्ध तरीके से समाप्त करना और टिकाऊ कृषि को बढ़ावा देना शामिल है।`,
    },
    {
      articleId: heroArticle.id,
      language: "kn",
      slug: "global-leaders-unite-for-greener-tomorrow-climate-summit-kn",
      title: "ಐತಿಹಾಸಿಕ ಹವಾಮಾನ ಶೃಂಗಸಭೆಯಲ್ಲಿ ಹಸಿರು ನಾಳೆಗಾಗಿ ಒಗ್ಗೂಡಿದ ವಿಶ್ವ ನಾಯಕರು",
      summary: "190 ಕ್ಕೂ ಹೆಚ್ಚು ದೇಶಗಳ ನಾಯಕರು ಶುದ್ಧ ಇಂಧನಕ್ಕಾಗಿ $500 ಶತಕೋಟಿ ನಿಧಿಯನ್ನು ಘೋಷಿಸಿ, ಹವಾಮಾನ ಬದಲಾವಣೆಯ ವಿರುದ್ಧ ದೃಢ ನಿರ್ಧಾರ ಕೈಗೊಂಡಿದ್ದಾರೆ.",
      content: `ಇಂದು ನಡೆದ ಐತಿಹಾಸಿಕ ಶೃಂಗಸಭೆಯಲ್ಲಿ 190 ಕ್ಕೂ ಹೆಚ್ಚು ರಾಷ್ಟ್ರಗಳ ಮುಖ್ಯಸ್ಥರು ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನದತ್ತ ಜಾಗತಿಕ ಪರಿವರ್ತನೆಯನ್ನು ವೇಗಗೊಳಿಸಲು ಒಮ್ಮತಕ್ಕೆ ಬಂದಿದ್ದಾರೆ.

ಈ ನೂತನ ಒಪ್ಪಂದವು ಅಭಿವೃದ್ಧಿಶೀಲ ರಾಷ್ಟ್ರಗಳಿಗೆ ಸೌರ, ಪವನ ಮತ್ತು ಹಸಿರು ಹೈಡ್ರೋಜನ್ ಯೋಜನೆಗಳಿಗೆ ವಿಶೇಷ ನೆರವು ನೀಡುತ್ತದೆ. ಭಾರತದ ನಿಯೋಗವು ತನ್ನ ಪರಿಸರ ಸಂರಕ್ಷಣಾ ಗುರಿಗಳನ್ನು ಮುಂಚಿತವಾಗಿಯೇ ತಲುಪುತ್ತಿರುವ ಸಾಧನೆಯನ್ನು ಶೃಂಗಸಭೆಯಲ್ಲಿ ಶ್ಲಾಘಿಸಲಾಯಿತು.`,
    },
    {
      articleId: heroArticle.id,
      language: "ta",
      slug: "global-leaders-unite-for-greener-tomorrow-climate-summit-ta",
      title: "வரலாற்று சிறப்புமிக்க பருவநிலை உச்சி மாநாட்டில் பசுமை எதிர்காலத்திற்காக இணைந்த உலகத் தலைவர்கள்",
      summary: "190க்கும் மேற்பட்ட நாடுகளின் தலைவர்கள் தூய்மையான எரிசக்தி மாற்றத்திற்காக $500 பில்லியன் நிதியை அறிவித்து முக்கிய முடிவுகளை எடுத்துள்ளனர்.",
      content: `இன்று நடைபெற்ற உச்சி மாநாட்டில், 190க்கும் மேற்பட்ட நாடுகளின் பிரதிநிதிகள் புதுப்பிக்கத்தக்க எரிசக்தி பயன்பாட்டை துரிதப்படுத்துவதற்கான புதிய ஒப்பந்தத்தில் கையெழுத்திட்டனர்.

இந்த ஒப்பந்தம் வளரும் நாடுகளுக்கு தூய ஆற்றல் மற்றும் சூரிய மின்சக்தி திட்டங்களை செயல்படுத்த பெருமளவில் நிதி உதவி வழங்குகிறது. இந்தியா தனது இலக்குகளை முன்கூட்டியே அடைந்து வருவதாக பாராட்டு தெரிவிக்கப்பட்டது.`,
    },
    {
      articleId: heroArticle.id,
      language: "ur",
      slug: "global-leaders-unite-for-greener-tomorrow-climate-summit-ur",
      title: "تاریخی ماحولیاتی سربراہی اجلاس میں سرسبز مستقبل کے لیے عالمی رہنماؤں کا تاریخی اتحاد",
      summary: "190 سے زائد ممالک کے رہنماؤں نے ماحولیاتی تبدیلیوں سے نمٹنے کے لیے 500 ارب ڈالر کے گرین انرجی فنڈ کا اعلان کیا۔",
      content: `آج منعقد ہونے والے ایک تاریخی سربراہی اجلاس میں دنیا بھر کے 190 سے زائد ممالک کے رہنماؤں نے قابل تجدید توانائی کی جانب منتقلی کو تیز کرنے پر مکمل اتفاق رائے حاصل کیا۔

اس نئے معاہدے کے تحت ترقی پذیر ممالک کو شمسی اور ہوا سے توانائی پیدا کرنے کے منصوبوں کے لیے 500 ارب ڈالر کی فنانسنگ فراہم کی جائے گی۔ شرکاء نے ماحولیاتی تحفظ کو وقت کی اہم ترین ضرورت قرار دیا۔`,
    },
    {
      articleId: heroArticle.id,
      language: "bn",
      slug: "global-leaders-unite-for-greener-tomorrow-climate-summit-bn",
      title: "ঐতিহাসিক জলবায়ু শীর্ষ সম্মেলনে সবুজ ভবিষ্যতের লক্ষ্যে ঐক্যবদ্ধ বিশ্ব নেতারা",
      summary: "১৯০টিরও বেশি দেশের নেতারা জলবায়ু পরিবর্তনের বিরুদ্ধে দ্রুত পদক্ষেপ গ্রহণের অঙ্গীকার করেছেন এবং ৫০০ বিলিয়ন ডলারের ক্লিন এনার্জি ফান্ড গঠন করেছেন।",
      content: `আজকের যুগান্তকারী আন্তর্জাতিক সম্মেলনে ১৯০টিরও বেশি দেশের প্রতিনিধিরা নবায়নযোগ্য জ্বালানি গ্রহণের প্রক্রিয়াকে ত্বরান্বিত করতে একমত হয়েছেন।

এই চুক্তি উন্নয়নশীল দেশগুলিতে সৌর ও পরিবেশবান্ধব বিদ্যুৎ প্রকল্পের জন্য উল্লেখযোগ্য অর্থনৈতিক সহায়তা নিশ্চিত করবে।`,
    },
  ];

  for (const trans of translations) {
    await prisma.articleTranslation.create({
      data: {
        ...trans,
        status: "PUBLISHED",
      },
    });
  }

  console.log("Translations seeded.");

  // 5. Create Comments & Threaded Replies
  const comment1 = await prisma.comment.create({
    data: {
      articleId: heroArticle.id,
      userId: reader.id,
      content: "This is truly a momentous step forward. The emphasis on equitable clean technology transfer for developing nations is what was missing in earlier summits.",
      likesCount: 14,
      status: "APPROVED",
    },
  });

  await prisma.comment.create({
    data: {
      articleId: heroArticle.id,
      userId: editor.id,
      parentId: comment1.id,
      content: "Agreed, Aanya. The sovereign green bond guarantee mechanism will reduce debt burden significantly for Southeast Asian and African grids.",
      likesCount: 6,
      status: "APPROVED",
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      articleId: createdArticles[1].id,
      userId: reporter.id,
      content: "Clean corporate balance sheets and continuous capex investments are reflecting directly in market resilience. Great analytical piece!",
      likesCount: 9,
      status: "APPROVED",
    },
  });

  console.log("Comments seeded.");

  // 6. Create Bookmarks and Reactions
  await prisma.bookmark.create({
    data: {
      userId: reader.id,
      articleId: heroArticle.id,
    },
  });

  await prisma.bookmark.create({
    data: {
      userId: reader.id,
      articleId: createdArticles[2].id,
    },
  });

  await prisma.reaction.create({
    data: {
      userId: reader.id,
      articleId: heroArticle.id,
      type: "LIKE",
    },
  });

  // 7. Seed Submissions (Citizen Journalist & Contributor workflow)
  await prisma.submission.create({
    data: {
      headline: "Solar Micro-Grids Transform Mountain Villages in Himachal Pradesh",
      summary: "Decentralized photovoltaic battery banks provide uninterrupted clean power to remote Himalayan communities for the first time.",
      content: `In remote villages perched over 2,800 meters in the Spiti and Kinnaur districts, indigenous micro-grids powered entirely by high-efficiency bifacial solar cells are revitalizing mountain lifestyles.

Previously reliant on fragile transmission towers vulnerable to winter avalanches, local schools and health outposts now enjoy uninterrupted heating, high-speed broadband, and telemetry cold storage for life-saving serums.`,
      categoryId: catMap["technology"],
      contributorId: reporter.id,
      language: "en",
      location: "Shimla, India",
      sourceAttribution: "Direct field reporting & Himachal Energy Development Agency (HIMURJA)",
      featuredImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80",
      status: "PENDING",
      declarationSigned: true,
      tags: "RenewableEnergy,Himalayas,MicroGrids,India",
    },
  });

  await prisma.submission.create({
    data: {
      headline: "Community Seed Banks Revive Forgotten Climate-Hardy Millets in Deccan",
      summary: "Women-led agricultural collectives are preserving over 60 indigenous crop varieties resilient to prolonged droughts.",
      content: `Across the arid rain-shadow belts of North Karnataka and Telangana, agricultural self-help federations have established resilient community seed conservatories.

These indigenous varieties, requiring 60% less water than hybrid wheat or paddy, have demonstrated remarkable yields even during unseasonal heat spells.`,
      categoryId: catMap["lifestyle"],
      contributorId: reader.id,
      language: "en",
      location: "Kalaburagi, India",
      sourceAttribution: "Deccan Farmers Collective & Field Interviews",
      featuredImage: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&auto=format&fit=crop&q=80",
      status: "UNDER_REVIEW",
      declarationSigned: true,
      editorialNotes: "Assigned to Editor Priya Sundaram for fact-checking and photo attribution verification.",
      reviewedById: editor.id,
      tags: "Agriculture,Millets,Sustainability,RuralIndia",
    },
  });

  // 8. Seed Newsletter Subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: "subscriber.global@gmail.com", language: "en" },
      { email: "vikram.delhi@outlook.com", language: "hi" },
      { email: "suresh.chennai@yahoo.com", language: "ta" },
    ],
  });

  // 9. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: reader.id,
        title: "Welcome to Antigravity News!",
        message: "You can now personalize news topics, save stories, and participate in discussions.",
        link: "/en/profile",
      },
      {
        userId: reporter.id,
        title: "Submission Under Review",
        message: "Your story on Solar Micro-Grids is currently under editorial review.",
        link: "/en/profile",
      },
    ],
  });

  console.log("Antigravity News database seeded successfully with rich multilingual datasets!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
