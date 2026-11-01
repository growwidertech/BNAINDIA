import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRequiredRole, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_ROLES = ["SUPERADMIN", "ADMIN", "EDITOR", "REPORTER", "CONTRIBUTOR", "READER"];

// GET: List all users
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !hasRequiredRole(sessionUser.role, "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        bio: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            submissions: true,
            comments: true,
            articles: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: Create a new user login with any role (SuperAdmin, Admin, Editor, Reporter, Contributor, Reader)
export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !hasRequiredRole(sessionUser.role, "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required to create logins." }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, location, bio, isActive = true } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email ID is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const cleanRole = (role || "READER").toUpperCase().trim();
    if (!VALID_ROLES.includes(cleanRole)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed roles: ${VALID_ROLES.join(", ")}` },
        { status: 400 }
      );
    }

    // Only SUPERADMIN can create another SUPERADMIN
    if (cleanRole === "SUPERADMIN" && sessionUser.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Only Super Administrators can create another Super Administrator account." },
        { status: 403 }
      );
    }

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: cleanRole,
        location: location ? location.trim() : null,
        bio: bio ? bio.trim() : null,
        isActive: Boolean(isActive),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        bio: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            submissions: true,
            comments: true,
            articles: true,
          },
        },
      },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: sessionUser.id,
        action: "ADMIN_USER_CREATED",
        entity: "User",
        entityId: newUser.id,
        details: `Login created by ${sessionUser.name} (${sessionUser.role}) for "${newUser.name}" with role "${newUser.role}" (${newUser.email}).`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `New ${cleanRole} login created successfully.`,
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user login" }, { status: 500 });
  }
}

// PATCH: Update user role, name, email, active status, or reset password
export async function PATCH(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !hasRequiredRole(sessionUser.role, "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, name, email, role, isActive, password, location, bio } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const updateData: any = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email && email.trim()) {
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (emailTaken && emailTaken.id !== userId) {
          return NextResponse.json({ error: "Email is already taken by another account." }, { status: 409 });
        }
        updateData.email = cleanEmail;
      }
    }

    if (role) {
      const cleanRole = role.toUpperCase().trim();
      if (!VALID_ROLES.includes(cleanRole)) {
        return NextResponse.json({ error: `Invalid role: ${role}` }, { status: 400 });
      }

      if (cleanRole === "SUPERADMIN" && sessionUser.role !== "SUPERADMIN") {
        return NextResponse.json({ error: "Only SuperAdmins can promote accounts to SuperAdmin." }, { status: 403 });
      }

      // Prevent demoting the only SuperAdmin
      if (existingUser.role === "SUPERADMIN" && cleanRole !== "SUPERADMIN" && sessionUser.id === existingUser.id) {
        return NextResponse.json({ error: "You cannot demote your own SuperAdmin account." }, { status: 400 });
      }

      updateData.role = cleanRole;
    }

    if (isActive !== undefined) {
      if (sessionUser.id === userId && isActive === false) {
        return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
      }
      updateData.isActive = Boolean(isActive);
    }

    if (password && password.trim().length >= 6) {
      updateData.passwordHash = await hashPassword(password.trim());
    }

    if (location !== undefined) {
      updateData.location = location ? location.trim() : null;
    }

    if (bio !== undefined) {
      updateData.bio = bio ? bio.trim() : null;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        bio: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            submissions: true,
            comments: true,
            articles: true,
          },
        },
      },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: sessionUser.id,
        action: "ADMIN_USER_UPDATED",
        entity: "User",
        entityId: updated.id,
        details: `Account "${updated.name}" updated by ${sessionUser.name}. Changes: ${Object.keys(updateData).join(", ")}.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User account updated successfully.",
      user: updated,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE: Delete a user account (with protection against self-deletion)
export async function DELETE(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !hasRequiredRole(sessionUser.role, "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (sessionUser.id === userId) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (targetUser.role === "SUPERADMIN" && sessionUser.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Only SuperAdmins can delete a SuperAdmin account." }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.auditLog.create({
      data: {
        userId: sessionUser.id,
        action: "ADMIN_USER_DELETED",
        entity: "User",
        entityId: userId,
        details: `User account "${targetUser.name}" (${targetUser.email}, ${targetUser.role}) was deleted by ${sessionUser.name}.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${targetUser.name} was successfully removed.`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
