"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilLine, Plus, Search, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { QuestionCategory, QuestionDifficulty, QuestionRecord } from "@/lib/mocksy/question-store";

type QuestionFormState = {
  text: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
};

type QuestionFormMode = "create" | "edit";

const CATEGORY_OPTIONS: Array<{ value: QuestionCategory; label: string }> = [
  { value: "about_yourself", label: "About Yourself" },
  { value: "course_university", label: "Course & University" },
  { value: "uk_country", label: "UK Country" },
  { value: "previous_study", label: "Previous Study" },
  { value: "finance", label: "Finance" },
  { value: "future_plan", label: "Future Plan" },
  { value: "research_preparation", label: "Research Preparation" },
  { value: "personal_lifestyle", label: "Personal Lifestyle" },
];

const DIFFICULTY_OPTIONS: Array<{ value: QuestionDifficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const INITIAL_FORM_STATE: QuestionFormState = {
  text: "",
  category: "about_yourself",
  difficulty: "medium",
};

function categoryLabel(category: QuestionCategory) {
  return CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

function difficultyLabel(difficulty: QuestionDifficulty) {
  return DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label ?? difficulty;
}

function difficultyClass(difficulty: QuestionDifficulty) {
  switch (difficulty) {
    case "easy":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "medium":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    case "hard":
      return "bg-red-500/10 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  }
}

function formatDate(value: string) {
  return value || "-";
}

function QuestionFormModal({
  open,
  onClose,
  onSaved,
  mode,
  initialState,
  questionId,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  mode: QuestionFormMode;
  initialState: QuestionFormState;
  questionId?: string;
}) {
  const [formState, setFormState] = useState<QuestionFormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormState(initialState);
      setErrorMessage(null);
      setSuccessMessage(null);
      setSaving(false);
    }
  }, [open, initialState]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const endpoint = mode === "edit" ? `/api/admin/questions/${questionId}` : "/api/admin/questions";
      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (mode === "edit" && !questionId) {
        throw new Error("Unable to update question.");
      }

      if (!response.ok) {
        throw new Error(mode === "edit" ? "Unable to update question." : "Unable to create question.");
      }

      setSuccessMessage(mode === "edit" ? "Question updated successfully." : "Question saved successfully.");
      await onSaved();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : mode === "edit" ? "Unable to update question." : "Unable to save question.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-3xl border-primary/50 bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">{mode === "edit" ? "Edit Question" : "Add New Question"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close add question modal">
            <X className="size-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Question Title</label>
            <Input
              value={formState.text}
              onChange={(event) => setFormState((current) => ({ ...current, text: event.target.value }))}
              placeholder="Enter question title"
              className="mt-1.5 rounded-lg"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={formState.category}
                onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value as QuestionCategory }))}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty Level</label>
              <select
                value={formState.difficulty}
                onChange={(event) => setFormState((current) => ({ ...current, difficulty: event.target.value as QuestionDifficulty }))}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="rounded-lg" disabled={saving}>
              {saving ? (mode === "edit" ? "Updating..." : "Saving...") : mode === "edit" ? "Update Question" : "Save Question"}
            </Button>
            <Button variant="outline" onClick={onClose} className="rounded-lg" type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function QuestionPage() {
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuestionRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pageSize = 8;

  const loadQuestions = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/questions", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load questions.");
      }

      const data = (await response.json()) as { questions: QuestionRecord[] };
      setQuestions(data.questions ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuestions();
  }, []);

  const filteredQuestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !query ||
        question.text.toLowerCase().includes(query) ||
        categoryLabel(question.category).toLowerCase().includes(query) ||
        difficultyLabel(question.difficulty).toLowerCase().includes(query);

      const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [questions, searchTerm, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredQuestions.slice(startIndex, startIndex + pageSize);
  }, [filteredQuestions, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const openCreateModal = () => {
    setEditQuestion(null);
    setModalOpen(true);
  };

  const openEditModal = (question: QuestionRecord) => {
    setEditQuestion(question);
    setModalOpen(true);
  };

  const handleDelete = async (question: QuestionRecord) => {
    const confirmed = window.confirm(`Delete "${question.text}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/questions/${question.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete question.");
      }

      await loadQuestions();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete question.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
          <p className="text-muted-foreground">Manage interview questions</p>
        </div>

        <Button className="rounded-lg w-full sm:w-auto" onClick={openCreateModal}>
          <Plus className="mr-2 size-4" />
          Add Question
        </Button>
      </div>

      <Card className="rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search questions..."
              className="pl-10 rounded-lg"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as QuestionCategory | "all")}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {errorMessage && (
        <Card className="border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </Card>
      )}

      <Card className="overflow-hidden rounded-2xl border bg-card/80 shadow-sm">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold">Question</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Difficulty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Created Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-muted-foreground" colSpan={5}>
                    Loading questions...
                  </td>
                </tr>
              ) : paginatedQuestions.length ? (
                paginatedQuestions.map((question, idx) => (
                  <tr
                    key={question.id}
                    className={`border-b transition-colors hover:bg-muted/50 ${idx === paginatedQuestions.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="truncate font-medium">{question.text}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{categoryLabel(question.category)}</td>
                    <td className="px-6 py-4">
                      <Badge className={`rounded-full ${difficultyClass(question.difficulty)}`} variant="outline">
                        {difficultyLabel(question.difficulty)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(question.createdAt)}</td>
                    <td className="px-6 py-4">
                      <TooltipProvider>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 w-9 rounded-lg p-0"
                                onClick={() => openEditModal(question)}
                                aria-label="Edit question"
                              >
                                <PencilLine className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 w-9 rounded-lg p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => void handleDelete(question)}
                                aria-label="Delete question"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-8 text-sm text-muted-foreground" colSpan={5}>
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-3 p-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading questions...</div>
          ) : paginatedQuestions.length ? (
            paginatedQuestions.map((question) => (
              <Card key={question.id} className="rounded-2xl border bg-card/80 p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{question.text}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{categoryLabel(question.category)}</span>
                      <span className="inline-block">•</span>
                      <Badge className={`rounded-full ${difficultyClass(question.difficulty)}`} variant="outline">
                        {difficultyLabel(question.difficulty)}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{formatDate(question.createdAt)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="h-9 w-9 rounded-lg p-0" onClick={() => openEditModal(question)} aria-label="Edit">
                        <PencilLine className="size-4" />
                      </Button>
                      <Button type="button" variant="outline" className="h-9 w-9 rounded-lg p-0 text-destructive" onClick={() => void handleDelete(question)} aria-label="Delete">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No questions found.</div>
          )}
        </div>

        {!loading && filteredQuestions.length > 0 && (
          <div className="flex flex-col gap-3 border-t bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((safeCurrentPage - 1) * pageSize + 1, filteredQuestions.length)} to {Math.min(safeCurrentPage * pageSize, filteredQuestions.length)} of {filteredQuestions.length} questions
            </p>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={safeCurrentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(Math.max(0, safeCurrentPage - 2), Math.max(0, safeCurrentPage - 2) + 3)
                  .map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      type="button"
                      variant={pageNumber === safeCurrentPage ? "default" : "outline"}
                      className="h-9 w-9 rounded-lg px-0"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <QuestionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={loadQuestions}
        mode={editQuestion ? "edit" : "create"}
        initialState={editQuestion ?? INITIAL_FORM_STATE}
        questionId={editQuestion?.id}
      />
    </div>
  );
}
