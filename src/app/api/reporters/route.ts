import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INDIAN_STATES_DISTRICTS } from "@/lib/districts";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");
    const state = searchParams.get("state");
    const location = searchParams.get("location");
    const search = searchParams.get("search");

    const where: any = {
      status: "APPROVED",
    };

    if (district && district !== "All Districts" && district !== "All Locations") {
      where.OR = [
        { district: { contains: district } },
        { location: { contains: district } },
      ];
    } else if (location && location !== "All Locations") {
      where.OR = [
        { location: { contains: location } },
        { district: { contains: location } },
        { state: { contains: location } },
      ];
    }

    if (state && state !== "All States") {
      where.state = { contains: state };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        {
          OR: [
            { name: { contains: q } },
            { district: { contains: q } },
            { state: { contains: q } },
            { location: { contains: q } },
            { qualification: { contains: q } },
            { language: { contains: q } },
            { beat: { contains: q } },
          ],
        },
      ];
    }

    // Explicitly exclude phone numbers from public API response
    const reporters = await prisma.reporter.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        // phone is deliberately omitted to protect reporter privacy
        district: true,
        state: true,
        location: true,
        qualification: true,
        language: true,
        beat: true,
        photoUrl: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Query distinct districts and states present in database
    const allReporters = await prisma.reporter.findMany({
      select: { district: true, state: true, location: true },
    });

    const dbDistricts = Array.from(
      new Set(allReporters.map((r) => r.district).filter(Boolean) as string[])
    );
    const dbStates = Array.from(
      new Set(allReporters.map((r) => r.state).filter(Boolean) as string[])
    );

    return NextResponse.json({
      reporters,
      districts: dbDistricts,
      states: dbStates,
      districtStateMap: INDIAN_STATES_DISTRICTS,
    });
  } catch (error) {
    console.error("Fetch reporters error:", error);
    return NextResponse.json({ error: "Failed to fetch reporters" }, { status: 500 });
  }
}
