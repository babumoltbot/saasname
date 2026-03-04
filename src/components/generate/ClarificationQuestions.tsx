"use client";

import { useState } from "react";
import type { ClarificationQuestion, Clarification } from "@/lib/services/interfaces";

interface Props {
  questions: ClarificationQuestion[];
  onSubmit: (clarifications: Clarification[]) => void;
  onSkip: () => void;
  loading: boolean;
}

export default function ClarificationQuestions({ questions, onSubmit, onSkip, loading }: Props) {
  // For text questions: string value
  // For single-select: the selected option string
  // For multi-select: comma-joined selected options
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, Set<string>>>({});
  const [customOpen, setCustomOpen] = useState<Record<string, boolean>>({});
  const [customText, setCustomText] = useState<Record<string, string>>({});

  const syncAnswer = (id: string, q: ClarificationQuestion) => {
    const selections = multiSelections[id] || new Set<string>();
    const custom = customText[id]?.trim() || "";

    if (q.type === "single-select") {
      // For single-select, custom replaces the chip selection
      // Already handled inline
      return;
    }

    // multi-select: join selections + custom
    const parts = [...Array.from(selections), ...(custom ? [custom] : [])];
    setAnswers((a) => ({ ...a, [id]: parts.join(", ") }));
  };

  const handleTextChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSingleSelect = (id: string, option: string) => {
    // Selecting a preset clears custom mode
    setCustomOpen((prev) => ({ ...prev, [id]: false }));
    setCustomText((prev) => ({ ...prev, [id]: "" }));
    setAnswers((prev) => ({
      ...prev,
      [id]: prev[id] === option ? "" : option,
    }));
  };

  const handleSingleCustomToggle = (id: string) => {
    const opening = !customOpen[id];
    setCustomOpen((prev) => ({ ...prev, [id]: opening }));
    if (opening) {
      // Clear chip selection; answer will come from custom text
      setAnswers((prev) => ({ ...prev, [id]: customText[id]?.trim() || "" }));
    } else {
      // Closing custom — clear custom text and answer
      setCustomText((prev) => ({ ...prev, [id]: "" }));
      setAnswers((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSingleCustomText = (id: string, value: string) => {
    setCustomText((prev) => ({ ...prev, [id]: value }));
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleMultiSelect = (id: string, option: string, q: ClarificationQuestion) => {
    setMultiSelections((prev) => {
      const current = new Set(prev[id] || []);
      if (current.has(option)) {
        current.delete(option);
      } else {
        current.add(option);
      }
      const next = { ...prev, [id]: current };
      // Sync answer: selections + custom text
      const custom = customText[id]?.trim() || "";
      const parts = [...Array.from(current), ...(custom ? [custom] : [])];
      setAnswers((a) => ({ ...a, [id]: parts.join(", ") }));
      return next;
    });
  };

  const handleMultiCustomToggle = (id: string, q: ClarificationQuestion) => {
    const opening = !customOpen[id];
    setCustomOpen((prev) => ({ ...prev, [id]: opening }));
    if (!opening) {
      // Closing — remove custom text from answer
      setCustomText((prev) => ({ ...prev, [id]: "" }));
      const selections = multiSelections[id] || new Set<string>();
      setAnswers((a) => ({ ...a, [id]: Array.from(selections).join(", ") }));
    }
  };

  const handleMultiCustomText = (id: string, value: string, q: ClarificationQuestion) => {
    setCustomText((prev) => ({ ...prev, [id]: value }));
    const selections = multiSelections[id] || new Set<string>();
    const parts = [...Array.from(selections), ...(value.trim() ? [value.trim()] : [])];
    setAnswers((a) => ({ ...a, [id]: parts.join(", ") }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clarifications: Clarification[] = questions
      .filter((q) => answers[q.id]?.trim())
      .map((q) => ({ question: q.question, answer: answers[q.id].trim() }));
    onSubmit(clarifications);
  };

  const hasAnswers = Object.values(answers).some((a) => a.trim());

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="rounded-2xl border border-border/60 bg-surface/70 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="flex-1 text-center text-[11px] font-[family-name:var(--font-mono)] text-text-muted tracking-wide">
            optional — help us generate better names
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <label className="block text-sm text-text-primary mb-2 font-medium">
                {q.question}
              </label>

              {q.type === "text" ? (
                <input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  disabled={loading}
                  className="w-full px-4 py-2.5 font-[family-name:var(--font-mono)] text-sm text-text-primary bg-black/30 border border-border/50 rounded-xl outline-none focus:border-accent/50 transition-all placeholder:text-text-muted/50"
                />
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map((option) => {
                      const isSelected =
                        q.type === "multi-select"
                          ? multiSelections[q.id]?.has(option)
                          : !customOpen[q.id] && answers[q.id] === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            q.type === "multi-select"
                              ? handleMultiSelect(q.id, option, q)
                              : handleSingleSelect(q.id, option)
                          }
                          className={`px-3.5 py-1.5 text-sm rounded-lg border transition-all cursor-pointer disabled:opacity-40 ${
                            isSelected
                              ? "bg-accent/15 border-accent/50 text-accent font-medium"
                              : "bg-black/20 border-border/50 text-text-secondary hover:border-border hover:text-text-primary"
                          }`}
                        >
                          {q.type === "multi-select" && isSelected && (
                            <span className="mr-1.5">&#10003;</span>
                          )}
                          {option}
                        </button>
                      );
                    })}
                    {/* "Other" chip */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        q.type === "multi-select"
                          ? handleMultiCustomToggle(q.id, q)
                          : handleSingleCustomToggle(q.id)
                      }
                      className={`px-3.5 py-1.5 text-sm rounded-lg border transition-all cursor-pointer disabled:opacity-40 ${
                        customOpen[q.id]
                          ? "bg-accent/15 border-accent/50 text-accent font-medium"
                          : "bg-black/20 border-dashed border-border/50 text-text-muted hover:border-border hover:text-text-primary"
                      }`}
                    >
                      Other...
                    </button>
                  </div>
                  {customOpen[q.id] && (
                    <input
                      type="text"
                      autoFocus
                      value={customText[q.id] || ""}
                      onChange={(e) =>
                        q.type === "multi-select"
                          ? handleMultiCustomText(q.id, e.target.value, q)
                          : handleSingleCustomText(q.id, e.target.value)
                      }
                      placeholder="Type your answer..."
                      disabled={loading}
                      className="w-full px-4 py-2 font-[family-name:var(--font-mono)] text-sm text-text-primary bg-black/30 border border-border/50 rounded-xl outline-none focus:border-accent/50 transition-all placeholder:text-text-muted/50"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <button
              type="button"
              onClick={onSkip}
              disabled={loading}
              className="text-xs font-[family-name:var(--font-mono)] text-text-muted hover:text-text-secondary transition-colors disabled:opacity-40"
            >
              Skip & Generate
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-accent rounded-lg hover:translate-y-[-1px] hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  {hasAnswers ? "Generate Names" : "Generate Without Answers"}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
