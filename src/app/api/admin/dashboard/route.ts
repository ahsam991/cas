import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getAdminDashboardSummary } from "@/lib/admin-data";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = await getAdminDashboardSummary();
  return NextResponse.json({ dashboard, userName: session.user?.name ?? "Admin" });
}
