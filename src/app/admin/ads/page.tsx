import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser, hasRequiredRole } from "@/lib/auth";
import { getAdSettings } from "@/lib/ads";
import { AdManagement } from "@/components/admin/AdManagement";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const user = await getCurrentUser();

  if (!user || !hasRequiredRole(user.role, "ADMIN")) {
    redirect("/en/auth/signin?redirect=/admin/ads");
  }

  const settings = await getAdSettings();

  return <AdManagement initialSettings={settings} />;
}
