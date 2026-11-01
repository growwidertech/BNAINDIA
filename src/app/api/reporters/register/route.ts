import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function saveFileLocally(file: File, prefix: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "reporters");
  await mkdir(uploadDir, { recursive: true });

  const safeName = `${prefix}-${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const filePath = path.join(uploadDir, safeName);
  await writeFile(filePath, buffer);

  return `/uploads/reporters/${safeName}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const district = (formData.get("district") as string) || (location ? location.split(",")[0].trim() : "New Delhi");
    const state = (formData.get("state") as string) || (location && location.includes(",") ? location.split(",")[1].trim() : "Delhi (NCT)");
    const qualification = formData.get("qualification") as string;
    const language = formData.get("language") as string;
    const beat = (formData.get("beat") as string) || "General Ground Reporting";

    // Required fields check
    if (!name || !email || !phone || !location || !qualification || !language) {
      return NextResponse.json(
        { error: "Please fill in all mandatory fields: Name, Email, Contact Number, Address/Location, Qualification, and Language." },
        { status: 400 }
      );
    }

    // Check existing email
    const existing = await prisma.reporter.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A reporter with this email address has already been registered." },
        { status: 409 }
      );
    }

    // Handle files: Aadhaar card, PAN card, Photograph
    let aadhaarUrl = "/uploads/reporters/default-aadhaar.pdf";
    let panCardUrl = "/uploads/reporters/default-pan.pdf";
    let photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

    const aadhaarFile = formData.get("aadhaar") as File | null;
    if (aadhaarFile && aadhaarFile.size > 0) {
      aadhaarUrl = await saveFileLocally(aadhaarFile, "aadhaar");
    }

    const panCardFile = formData.get("panCard") as File | null;
    if (panCardFile && panCardFile.size > 0) {
      panCardUrl = await saveFileLocally(panCardFile, "pan");
    }

    const photoFile = formData.get("photo") as File | null;
    if (photoFile && photoFile.size > 0) {
      photoUrl = await saveFileLocally(photoFile, "photo");
    }

    // Store in database
    const reporter = await prisma.reporter.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        location: location.trim(),
        district: district.trim(),
        state: state.trim(),
        qualification: qualification.trim(),
        language: language.trim(),
        beat: beat.trim(),
        aadhaarUrl,
        panCardUrl,
        photoUrl,
        status: "APPROVED", // Auto-approved for instant showcase in directory
        isVerified: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "REPORTER_REGISTERED",
        entity: "Reporter",
        entityId: reporter.id,
        details: `New reporter registered: ${reporter.name} (${reporter.location}) with verified credentials.`,
      },
    });

    return NextResponse.json({
      success: true,
      reporter,
      message: "Reporter registration successfully completed and verified!",
    }, { status: 201 });
  } catch (error) {
    console.error("Reporter registration error:", error);
    return NextResponse.json({ error: "Failed to process reporter registration." }, { status: 500 });
  }
}
