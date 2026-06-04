import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";

type UserRole = "admin" | "buyer" | "seller";
type UserRoleRecord = {
  role?: UserRole;
};

export type AdminSession = Session & {
  user: NonNullable<Session["user"]> & {
    email: string;
    role: "admin";
  };
};

export type DashboardSession = Session & {
  user: NonNullable<Session["user"]> & {
    email: string;
    role: UserRole;
  };
};

export function dashboardPathForRole(role?: string) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "seller") return "/dashboard/seller";
  if (role === "buyer") return "/dashboard/buyer";
  return "/dashboard";
}

async function getSessionWithDbRole() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { status: "unauthorized" as const };
  }

  await connectDB();

  const user = (await UserModel.findOne({ email: session.user.email })
    .select("role")
    .lean()) as UserRoleRecord | null;

  if (!user?.role) {
    return { status: "forbidden" as const, session };
  }

  return { status: "ok" as const, session, role: user.role };
}

function toAdminSession(session: Session): AdminSession {
  return {
    ...session,
    user: {
      ...session.user,
      email: session.user.email || "",
      role: "admin",
    },
  } as AdminSession;
}

function toDashboardSession(session: Session, role: UserRole): DashboardSession {
  return {
    ...session,
    user: {
      ...session.user,
      email: session.user.email || "",
      role,
    },
  } as DashboardSession;
}

export async function requireAdminPage() {
  const result = await getSessionWithDbRole();

  if (result.status === "unauthorized") {
    redirect("/login");
  }

  if (result.status !== "ok" || result.role !== "admin") {
    redirect(dashboardPathForRole(result.status === "ok" ? result.role : undefined));
  }

  return toAdminSession(result.session);
}

export async function requireDashboardRolePage(requiredRole: UserRole) {
  const result = await getSessionWithDbRole();

  if (result.status === "unauthorized") {
    redirect("/login");
  }

  if (result.status !== "ok" || result.role !== requiredRole) {
    redirect(dashboardPathForRole(result.status === "ok" ? result.role : undefined));
  }

  return toDashboardSession(result.session, result.role);
}

export async function requireAdminApi() {
  const result = await getSessionWithDbRole();

  if (result.status === "unauthorized") {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (result.status !== "ok" || result.role !== "admin") {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session: toAdminSession(result.session) };
}
