import { NextResponse } from "next/server";

import { createQuestion, getQuestions } from "@/lib/mocksy/question-store";

export async function GET() {
  const questions = await getQuestions();
  return NextResponse.json({ questions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const question = await createQuestion({
    text: String(body.text ?? "").trim(),
    category: body.category,
    difficulty: body.difficulty,
    status: body.status,
  });

  return NextResponse.json({ question }, { status: 201 });
}
