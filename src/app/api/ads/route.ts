import { NextResponse } from "next/server";
import { getAdSettings } from "@/lib/ads";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getAdSettings();
    return NextResponse.json({
      adsenseEnabled: settings.adsenseEnabled,
      publisherId: settings.publisherId,
      autoAdsEnabled: settings.autoAdsEnabled,
      testMode: settings.testMode,
      headerSlotId: settings.headerSlotId,
      inArticleSlotId: settings.inArticleSlotId,
      sidebarSlotId: settings.sidebarSlotId,
      feedSlotId: settings.feedSlotId,
      footerSlotId: settings.footerSlotId,
      customHeaderCode: settings.customHeaderCode,
      customSidebarCode: settings.customSidebarCode,
    });
  } catch (error) {
    console.error("Public ad settings error:", error);
    return NextResponse.json({ error: "Failed to fetch ad settings" }, { status: 500 });
  }
}
