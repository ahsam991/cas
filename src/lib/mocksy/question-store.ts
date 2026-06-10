import { ObjectId } from "mongodb";

import { getMongoClientPromise } from "@/lib/mongodb";

export type QuestionCategory =
  | "about_yourself"
  | "course_university"
  | "uk_country"
  | "previous_study"
  | "finance"
  | "future_plan"
  | "research_preparation"
  | "personal_lifestyle";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionDocument = {
  _id?: ObjectId;
  text: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  createdAt: Date;
  updatedAt?: Date;
  status: "published" | "draft";
};

export type QuestionRecord = {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
};

export const QUESTION_SEED: Array<Pick<QuestionDocument, "text" | "category" | "difficulty">> = [
  { text: "Tell me about yourself", category: "about_yourself", difficulty: "easy" },
  { text: "What are your strengths?", category: "about_yourself", difficulty: "easy" },
  { text: "What are your weaknesses?", category: "about_yourself", difficulty: "medium" },
  { text: "What are your short-term goals?", category: "about_yourself", difficulty: "medium" },
  { text: "What are your long-term goals?", category: "about_yourself", difficulty: "medium" },
  { text: "Why did you choose this course?", category: "course_university", difficulty: "easy" },
  { text: "Why did you choose this university?", category: "course_university", difficulty: "easy" },
  { text: "What do you know about your course?", category: "course_university", difficulty: "easy" },
  { text: "What modules will you study?", category: "course_university", difficulty: "medium" },
  { text: "How many credits does your course contain?", category: "course_university", difficulty: "medium" },
  { text: "Which module are you most excited about?", category: "course_university", difficulty: "medium" },
  { text: "Which module do you think is difficult?", category: "course_university", difficulty: "medium" },
  { text: "Why did you choose the UK?", category: "uk_country", difficulty: "easy" },
  { text: "What are the benefits of studying in the UK?", category: "uk_country", difficulty: "medium" },
  { text: "What do you know about UK culture?", category: "uk_country", difficulty: "medium" },
  { text: "What challenges may you face in the UK?", category: "uk_country", difficulty: "medium" },
  { text: "What was your previous qualification?", category: "previous_study", difficulty: "easy" },
  { text: "Is your previous study related to this course?", category: "previous_study", difficulty: "medium" },
  { text: "Tell me about your academic background", category: "previous_study", difficulty: "easy" },
  { text: "What projects have you done?", category: "previous_study", difficulty: "medium" },
  { text: "Who is sponsoring your studies?", category: "finance", difficulty: "easy" },
  { text: "What does your sponsor do?", category: "finance", difficulty: "medium" },
  { text: "How will you pay your tuition fees?", category: "finance", difficulty: "easy" },
  { text: "Do you have sufficient funds?", category: "finance", difficulty: "easy" },
  { text: "What are your future career plans?", category: "future_plan", difficulty: "medium" },
  { text: "What will you do after completing your course?", category: "future_plan", difficulty: "medium" },
  { text: "How will this course help your career?", category: "future_plan", difficulty: "medium" },
  { text: "How did you find this university?", category: "research_preparation", difficulty: "easy" },
  { text: "What research did you do before applying?", category: "research_preparation", difficulty: "medium" },
  { text: "Did you compare other universities?", category: "research_preparation", difficulty: "medium" },
  { text: "How will you adjust to life in the UK?", category: "personal_lifestyle", difficulty: "medium" },
  { text: "Where will you stay in the UK?", category: "personal_lifestyle", difficulty: "easy" },
  { text: "What will you do in your free time?", category: "personal_lifestyle", difficulty: "easy" },
];

function getQuestionsCollection() {
  return getMongoClientPromise().then((client) => client.db().collection<QuestionDocument>("questions"));
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function serializeQuestion(question: QuestionDocument): QuestionRecord {
  return {
    id: String(question._id ?? ""),
    text: question.text,
    category: question.category,
    difficulty: question.difficulty,
    status: question.status,
    createdAt: formatDate(question.createdAt),
    updatedAt: formatDate(question.updatedAt ?? question.createdAt),
  };
}

export async function seedQuestions() {
  const collection = await getQuestionsCollection();
  await collection.deleteMany({});

  const now = new Date();
  await collection.insertMany(
    QUESTION_SEED.map((question) => ({
      ...question,
      createdAt: now,
      updatedAt: now,
      status: "published" as const,
    })),
  );
}

export async function getQuestionCount() {
  const collection = await getQuestionsCollection();
  return collection.countDocuments();
}

export async function getQuestions(limit = 50) {
  const collection = await getQuestionsCollection();
  const questions = await collection.find({}, { sort: { createdAt: -1 }, limit }).toArray();
  return questions.map(serializeQuestion);
}

export async function getQuestionById(id: string) {
  const collection = await getQuestionsCollection();
  const question = await collection.findOne({ _id: new ObjectId(id) });
  return question ? serializeQuestion(question) : null;
}

export async function createQuestion(input: {
  text: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  status?: "published" | "draft";
}) {
  const collection = await getQuestionsCollection();
  const now = new Date();
  const result = await collection.insertOne({
    text: input.text,
    category: input.category,
    difficulty: input.difficulty,
    status: input.status ?? "draft",
    createdAt: now,
    updatedAt: now,
  });

  const inserted = await collection.findOne({ _id: result.insertedId });
  return inserted ? serializeQuestion(inserted) : null;
}

export async function updateQuestion(
  id: string,
  input: Partial<Pick<QuestionDocument, "text" | "category" | "difficulty" | "status">>,
) {
  const collection = await getQuestionsCollection();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
  );

  return getQuestionById(id);
}

export async function deleteQuestion(id: string) {
  const collection = await getQuestionsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
