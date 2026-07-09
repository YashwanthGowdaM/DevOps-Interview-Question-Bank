"use client";

import { useState } from "react";

export default function QuestionCard({ index, row }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const difficultyStyles = {
    Easy: "bg-brand-light text-brand-dark",
    Medium: "bg-amber/15 text-amber",
    Hard: "bg-red-100 text-red-700",
  };
  const diffClass =
    difficultyStyles[row["Difficulty Level"]] || "bg-canvas text-muted";

  return (
    <div className="rounded-lg border border-line bg-panel p-5 shadow-card transition-shadow hover:shadow-md">
      <div className="mb-2.5 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        <span className="font-semibold text-brand">Q{index}</span>
        {row.Module && <span className="rounded bg-canvas px-1.5 py-0.5">{row.Module}</span>}
        {row.Technology && <span className="rounded bg-canvas px-1.5 py-0.5">{row.Technology}</span>}
        {row.Concept && <span className="rounded bg-canvas px-1.5 py-0.5">{row.Concept}</span>}
        {row["Difficulty Level"] && (
          <span className={`rounded px-1.5 py-0.5 ${diffClass}`}>
            {row["Difficulty Level"]}
          </span>
        )}
      </div>

      <p className="font-semibold leading-relaxed text-ink">{row.Question}</p>

      {!showAnswer ? (
        <button
          type="button"
          onClick={() => setShowAnswer(true)}
          className="mt-3 text-sm font-medium text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
        >
          Click for answer
        </button>
      ) : (
        <div className="mt-3 border-t border-line pt-3">
          <p className="leading-relaxed text-muted">
            {row["Suggested Answer"]}
          </p>
          <button
            type="button"
            onClick={() => setShowAnswer(false)}
            className="mt-2 text-xs font-medium text-muted underline decoration-muted/40 underline-offset-4 hover:text-brand hover:decoration-brand"
          >
            Hide answer
          </button>
        </div>
      )}
    </div>
  );
}
