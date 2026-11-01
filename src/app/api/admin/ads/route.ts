import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRequiredRole } from "@/lib/auth";
import { getAdSettings } from "@/lib/ads";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !hasRequiredRole(sessionUser.role, "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const settings = await getAdSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Fetch ad settings error:", error);
    return NextResponse.json({ error: "Failed to fetch ad settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !hasRequiredRole(sessionUser.role, "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      adsenseEnabled,
      publisherId,
      autoAdsEnabled,
      testMode,
      headerSlotId,
      inArticleSlotId,
      sidebarSlotId,
      feedSlotId,
      footerSlotId,
      customHeaderCode,
      customSidebarCode,
    } = body;

    // Validation
    const cleanPublisherId = (publisherId || "").trim();
    if (adsenseEnabled && cleanPublisherId && !cleanPublisherId.startsWith("ca-pub-")) {
      return NextResponse.json(
        { error: "Google AdSense Publisher ID should begin with 'ca-pub-' (e.g. ca-pub-1234567890123456)." },
        { status: 400 }
      );
    }

    const updated = await prisma.adSetting.upsert({
      where: { id: "default" },
      update: {
        adsenseEnabled: Boolean(adsenseEnabled),
        publisherId: cleanPublisherId || "ca-pub-9876543210123456",
        autoAdsEnabled: Boolean(autoAdsEnabled),
        testMode: Boolean(testMode),
        headerSlotId: headerSlotId ? String(headerSlotId).trim() : null,
        inArticleSlotId: inArticleSlotId ? String(inArticleSlotId).trim() : null,
        sidebarSlotId: sidebarSlotId ? String(sidebarSlotId).trim() : null,
        feedSlotId: feedSlotId ? String(feedSlotId).trim() : null,
        footerSlotId: footerSlotId ? String(footerSlotId).trim() : null,
        customHeaderCode: customHeaderCode ? customHeaderCode.trim() : null,
        customSidebarCode: customSidebarCode ? customSidebarCode.trim() : null,
      },
      create: {
        id: "default",
        adsenseEnabled: Boolean(adsenseEnabled),
        publisherId: cleanPublisherId || "ca-pub-9876543210123456",
        autoAdsEnabled: Boolean(autoAdsEnabled),
        testMode: Boolean(testMode),
        headerSlotId: headerSlotId ? String(headerSlotId).trim() : null,
        inArticleSlotId: inArticleSlotId ? String(inArticleSlotId).trim() : null,
        sidebarSlotId: sidebarSlotId ? String(sidebarSlotId).trim() : null,
        feedSlotId: feedSlotId ? String(feedSlotId).trim() : null,
        footerSlotId: footerSlotId ? String(footerSlotId).trim() : null,
        customHeaderCode: customHeaderCode ? customHeaderCode.trim() : null,
        customSidebarCode: customSidebarCode ? customSidebarCode.trim() : null,
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: sessionUser.id,
        action: "ADMIN_ADS_UPDATED",
        entity: "AdSetting",
        entityId: updated.id,
        details: `Google AdSense configuration updated by ${sessionUser.name}. Publisher ID: ${updated.publisherId}, Status: ${updated.adsenseEnabled ? "Active" : "Disabled"}, TestMode: ${updated.testMode}.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Google AdSense configuration saved successfully.",
      settings: updated,
    });
  } catch (error) {
    console.error("Save ad settings error:", error);
    return NextResponse.json({ error: "Failed to save ad settings" }, { status: 500 });
  }
}
