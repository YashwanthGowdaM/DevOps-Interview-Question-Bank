"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import MultiSelect from "@/components/MultiSelect";
import QuestionCard from "@/components/QuestionCard";

const FILTER_FIELDS = ["Module", "Technology", "Concept"];

export default function Home() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ Module: [], Technology: [], Concept: [] });

  useEffect(() => {
    fetch("/data.csv")
      .then((res) => {
        if (!res.ok) throw new Error("data.csv not found in /public");
        return res.text();
      })
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim(),
        });
        // Uniq_ID in the source data is not guaranteed unique (it looks like
        // it tracks the upload batch, not the individual row) — several rows
        // can share the same value. Stamp every row with a truly unique id
        // at load time so React list keys never collide.
        const withRowId = parsed.data.map((row, i) => ({
          ...row,
          _rowId: `row-${i}`,
        }));
        setRows(withRowId);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Rows matching everything EXCEPT a given field — used to compute that field's own option list,
  // so each filter's choices narrow based on the *other* selected filters (true cascading).
  function rowsExcluding(field) {
    return rows.filter((row) =>
      FILTER_FIELDS.every((f) => {
        if (f === field) return true;
        if (filters[f].length === 0) return true;
        return filters[f].includes(row[f]);
      })
    );
  }

  const options = useMemo(() => {
    const result = {};
    FILTER_FIELDS.forEach((field) => {
      const source = rowsExcluding(field);
      result[field] = Array.from(
        new Set(source.map((r) => r[field]).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b));
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, filters]);

  // Drop any selected values that are no longer valid given the current cascade.
  useEffect(() => {
    setFilters((prev) => {
      let changed = false;
      const next = { ...prev };
      FILTER_FIELDS.forEach((field) => {
        const valid = prev[field].filter((v) => options[field]?.includes(v));
        if (valid.length !== prev[field].length) {
          next[field] = valid;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const filteredData = useMemo(() => {
    return rows.filter((row) => {
      const matchesFilters = FILTER_FIELDS.every((f) => {
        if (filters[f].length === 0) return true;
        return filters[f].includes(row[f]);
      });
      if (!matchesFilters) return false;
      if (search.trim() === "") return true;
      const q = search.toLowerCase();
      return (
        (row.Question || "").toLowerCase().includes(q) ||
        (row.Company || "").toLowerCase().includes(q)
      );
    });
  }, [rows, filters, search]);

  function updateFilter(field, values) {
    setFilters((prev) => ({ ...prev, [field]: values }));
  }

  function clearAll() {
    setFilters({ Module: [], Technology: [], Concept: [] });
    setSearch("");
  }

  function downloadCSV() {
    const exportRows = filteredData.map(({ _rowId, ...rest }) => rest);
    const csv = Papa.unparse(exportRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `devops-qa-filtered-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const activeFilterCount = FILTER_FIELDS.reduce(
    (sum, f) => sum + filters[f].length,
    0
  );

  return (
    <main className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              interview prep /
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              question bank
            </span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            DevOps &amp; Cloud Q&amp;A Explorer
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            Filter the question bank by module, technology, and concept. Each
            filter narrows the options below it — pick a module first to see
            only the relevant technologies and concepts.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading && (
          <p className="font-mono text-sm text-muted">Loading question bank…</p>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Couldn&apos;t load data.csv: {error}. Make sure your CSV file is at{" "}
            <code className="font-mono">public/data.csv</code>.
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Filter sidebar */}
            <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-72">
              <section className="rounded-xl border border-line bg-panel p-5 shadow-card">
                <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-ink">
                  Filters
                </h2>

                <div className="flex flex-col gap-4">
                  <MultiSelect
                    label="Module"
                    options={options.Module}
                    selected={filters.Module}
                    onChange={(v) => updateFilter("Module", v)}
                  />
                  <MultiSelect
                    label="Technology"
                    options={options.Technology}
                    selected={filters.Technology}
                    onChange={(v) => updateFilter("Technology", v)}
                  />
                  <MultiSelect
                    label="Concept"
                    options={options.Concept}
                    selected={filters.Concept}
                    onChange={(v) => updateFilter("Concept", v)}
                  />
                </div>

                <div className="mt-5 border-t border-line pt-4">
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
                    Search
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Question or company..."
                    className="w-full rounded-md border border-line bg-canvas px-3 py-2 text-sm outline-none focus-visible:border-brand"
                  />
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="mt-4 text-sm font-medium text-muted underline decoration-muted/40 underline-offset-4 hover:text-brand"
                  >
                    Clear filters
                  </button>
                )}

                <button
                  onClick={downloadCSV}
                  disabled={filteredData.length === 0}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download {filteredData.length} row{filteredData.length === 1 ? "" : "s"}
                </button>
              </section>
            </aside>

            {/* Results */}
            <section className="min-w-0 flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  {filteredData.length} of {rows.length} questions
                </p>
              </div>

              {filteredData.length === 0 ? (
                <div className="rounded-lg border border-dashed border-line bg-panel p-10 text-center">
                  <p className="text-sm text-muted">
                    No questions match this combination of filters. Try clearing
                    one of them.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredData.map((row, i) => (
                    <QuestionCard key={row._rowId} index={i + 1} row={row} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <footer className="border-t border-line py-6 text-center font-mono text-[11px] text-muted">
        Data loaded from public/data.csv · replace it with your own export to update the bank
      </footer>
    </main>
  );
}
