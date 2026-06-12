import { getMongoClientPromise } from "@/lib/mongodb";
import { getQuestions } from "@/lib/mocksy/question-store";

type DbUser = {
  _id?: unknown;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | string | null;
  role?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  lastSignInAt?: Date | string | null;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastSignInAt: string;
  emailVerified: string;
  avatar: string;
};

export type AdminDashboardSummary = {
  totalUsers: number;
  activeSessions: number;
  totalQuestions: number;
  totalUsersWithDetails: AdminUserRow[];
  recentActivities: AdminActivity[];
};

export type AdminActivity = {
  id: string;
  title: string;
  actor: string;
  timeLabel: string;
  kind: "user" | "question";
};

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function userLabel(value: string | null | undefined) {
  return value?.trim() || "Unknown user";
}

function timeSince(dateValue: Date | string | null | undefined) {
  if (!dateValue) return "Just now";

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function buildQuestionTitle(questionText: string, difficulty: string) {
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  return `${label} question added`;
}

export async function getAdminDashboardSummary() {
  const client = await getMongoClientPromise();
  const db = client.db();

  const [totalUsers, activeSessions, totalQuestions, users, questions] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("sessions").countDocuments({ expires: { $gt: new Date() } }),
    db.collection("questions").countDocuments(),
    db
      .collection("users")
      .find({}, { sort: { createdAt: -1 }, limit: 6 })
      .toArray(),
    getQuestions(6),
  ]);

  const recentActivities: AdminActivity[] = [
    ...users.slice(0, 3).map((user) => {
      const typedUser = user as DbUser;
      const createdAt = typedUser.createdAt ?? typedUser.updatedAt ?? typedUser.lastSignInAt;

      return {
        id: `user-${String(typedUser._id ?? typedUser.email ?? typedUser.name ?? crypto.randomUUID())}`,
        title: "User Signup",
        actor: userLabel(typedUser.name),
        timeLabel: timeSince(createdAt),
        kind: "user" as const,
      };
    }),
    ...questions.slice(0, 3).map((question) => ({
      id: `question-${question.id}`,
      title: buildQuestionTitle(question.text, question.difficulty),
      actor: "Admin",
      timeLabel: question.createdAt ? timeSince(question.createdAt) : "Just now",
      kind: "question" as const,
    })),
  ].slice(0, 5);

  return {
    totalUsers,
    activeSessions,
    totalQuestions,
    totalUsersWithDetails: users.map((user) => {
      const typedUser = user as DbUser;
      const primaryDate = typedUser.createdAt ?? typedUser.lastSignInAt ?? typedUser.emailVerified;
      const lastSignInDate = typedUser.lastSignInAt ?? typedUser.createdAt ?? typedUser.emailVerified;

      return {
        id: String(typedUser._id ?? typedUser.email ?? typedUser.name ?? crypto.randomUUID()),
        name: userLabel(typedUser.name),
        email: typedUser.email?.trim() || "-",
        role: typedUser.role?.trim() || "user",
        createdAt: formatDate(primaryDate),
        lastSignInAt: formatDate(lastSignInDate),
        emailVerified: formatDate(typedUser.emailVerified),
        avatar: typedUser.image?.trim() || "https://api.dicebear.com/7.x/avataaars/svg?seed=Mocksy",
      };
    }),
    recentActivities,
  } satisfies AdminDashboardSummary;
}
