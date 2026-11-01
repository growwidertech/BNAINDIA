import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LANGUAGE } from "@/lib/languages";
import { ProfileManager } from "@/components/profile/ProfileManager";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam || DEFAULT_LANGUAGE;
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect(`/${lang}/auth/signin`);
  }

  const profile = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      submissions: {
        include: { category: true },
        orderBy: { createdAt: "desc" },
      },
      comments: {
        include: {
          article: {
            select: {
              title: true,
              slug: true,
              category: { select: { slug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!profile) {
    redirect(`/${lang}/auth/signin`);
  }

  // Format submissions and comments for serialization
  const formattedSubmissions = profile.submissions.map((s) => ({
    id: s.id,
    headline: s.headline,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
    category: {
      name: s.category.name,
    },
  }));

  const formattedComments = profile.comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    article: {
      title: c.article.title,
      slug: c.article.slug,
      category: {
        slug: c.article.category.slug,
      },
    },
  }));

  return (
    <ProfileManager
      initialUser={{
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        location: profile.location,
        bio: profile.bio,
      }}
      submissions={formattedSubmissions}
      comments={formattedComments}
      lang={lang}
    />
  );
}
