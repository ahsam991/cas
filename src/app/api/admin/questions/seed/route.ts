import { NextResponse } from "next/server";

import { seedQuestions } from "@/lib/mocksy/question-store";

export async function POST() {
  await seedQuestions();
  return NextResponse.json({ ok: true });
}
