import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, location, bio } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Contact Name cannot be empty." }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email ID cannot be empty." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Check if email changed and is already taken by another account
    if (cleanEmail !== sessionUser.email.toLowerCase()) {
      const existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (existingUser && existingUser.id !== sessionUser.id) {
        return NextResponse.json(
          { error: "This Email ID is already registered to another account." },
          { status: 409 }
        );
      }
    }

    // Update user in database
    const updated = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        name: name.trim(),
        email: cleanEmail,
        location: location !== undefined ? (location ? location.trim() : null) : undefined,
        bio: bio !== undefined ? (bio ? bio.trim() : null) : undefined,
      },
    });

    // Create Audit Log entry
    await prisma.auditLog.create({
      data: {
        userId: updated.id,
        action: "USER_PROFILE_UPDATED",
        entity: "User",
        entityId: updated.id,
        details: `Login details updated: Contact Name set to "${updated.name}", Email ID set to "${updated.email}".`,
      },
    });

    const newSessionUser = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatarUrl: updated.avatarUrl,
    };

    // Sign new JWT token reflecting the updated Name and Email
    const newToken = signToken(newSessionUser);

    const response = NextResponse.json({
      success: true,
      message: "Contact name and email ID updated successfully.",
      user: newSessionUser,
    });

    // Refresh auth cookie
    const isSecure = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https://");
    response.cookies.set(AUTH_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
