import { NextResponse } from "next/server";

import { deleteQuestion, getQuestionById, updateQuestion } from "@/lib/mocksy/question-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const question = await getQuestionById(id);

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ question });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const question = await updateQuestion(id, {
    text: body.text ? String(body.text).trim() : undefined,
    category: body.category,
    difficulty: body.difficulty,
    status: body.status,
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ question });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteQuestion(id);

  if (!deleted) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}