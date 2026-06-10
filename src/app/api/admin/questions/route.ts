import { NextResponse } from "next/server";

import { createQuestion, getQuestions, QUESTION_SEED } from "@/lib/mocksy/question-store";

export async function GET() {
  // If no MongoDB URI is configured, serve the built-in seed questions so
  // the interview page works without a database connection.
  if (!process.env.MONGODB_URI) {
    const fallback = QUESTION_SEED.map((q, i) => ({
      id: `seed-${i}`,
      text: q.text,
      category: q.category,
      difficulty: q.difficulty,
      status: "published" as const,
      createdAt: "",
      updatedAt: "",
    }));
    return NextResponse.json({ questions: fallback });
  }

  try {
    const questions = await getQuestions();
    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({ error: "Failed to load questions from database." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const body = await request.json();
  const question = await createQuestion({
    text: String(body.text ?? "").trim(),
    category: body.category,
    difficulty: body.difficulty,
    status: body.status,
  });

  return NextResponse.json({ question }, { status: 201 });
}
