import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRequiredRole } from "@/lib/auth";
import { UserManagement } from "@/components/admin/UserManagement";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser || !hasRequiredRole(sessionUser.role, "ADMIN")) {
    redirect("/en/auth/signin");
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

  const formattedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <UserManagement
      initialUsers={formattedUsers}
      currentUserId={sessionUser.id}
      currentUserRole={sessionUser.role}
    />
  );
}
