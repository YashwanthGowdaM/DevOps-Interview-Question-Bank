"use client";

import { useEffect, useRef, useState } from "react";

export default function MultiSelect({ label, options, selected, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  function toggleValue(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div className="relative w-full" ref={ref}>
      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
          disabled
            ? "cursor-not-allowed border-line bg-canvas text-muted/60"
            : "border-line bg-panel hover:border-brand/50"
        } ${open ? "border-brand ring-1 ring-brand/30" : ""}`}
      >
        <span className={selected.length ? "text-ink" : "text-muted"}>
          {selected.length === 0
            ? disabled
              ? "—"
              : "All"
            : selected.length <= 2
            ? selected.join(", ")
            : `${selected.length} selected`}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && !disabled && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-md border border-line bg-panel shadow-card">
          <div className="border-b border-line p-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full rounded border border-line bg-canvas px-2.5 py-1.5 text-sm outline-none focus-visible:border-brand"
            />
          </div>
          <div className="thin-scroll max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted">No matches</p>
            )}
            {filteredOptions.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-brand-light/60"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleValue(opt)}
                  className="h-3.5 w-3.5 accent-brand"
                />
                <span className="truncate">{opt}</span>
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full border-t border-line px-3 py-2 text-left text-xs font-medium text-brand hover:bg-brand-light/60"
            >
              Clear {label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
