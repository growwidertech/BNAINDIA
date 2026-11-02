import { isCloudflareWorker, prisma } from "@/lib/prisma";

export interface AdSettingData {
  id: string;
  adsenseEnabled: boolean;
  publisherId: string;
  autoAdsEnabled: boolean;
  testMode: boolean;
  headerSlotId: string | null;
  inArticleSlotId: string | null;
  sidebarSlotId: string | null;
  feedSlotId: string | null;
  footerSlotId: string | null;
  customHeaderCode?: string | null;
  customSidebarCode?: string | null;
}

export const DEFAULT_AD_SETTINGS: AdSettingData = {
  id: "default",
  adsenseEnabled: true,
  publisherId: "ca-pub-9876543210123456",
  autoAdsEnabled: true,
  testMode: false,
  headerSlotId: "1010101010",
  inArticleSlotId: "2020202020",
  sidebarSlotId: "3030303030",
  feedSlotId: "4040404040",
  footerSlotId: "5050505050",
  customHeaderCode: null,
  customSidebarCode: null,
};

export async function getAdSettings(): Promise<AdSettingData> {
  if (isCloudflareWorker()) {
    return DEFAULT_AD_SETTINGS;
  }
  try {
    let settings = await prisma.adSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.adSetting.create({
        data: DEFAULT_AD_SETTINGS,
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching ad settings, using defaults:", error);
    return DEFAULT_AD_SETTINGS;
  }
}
