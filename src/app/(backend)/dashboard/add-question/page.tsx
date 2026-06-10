import { redirect } from "next/navigation";

export default function AddQuestionRedirectPage() {
  redirect("/dashboard/question");
}
