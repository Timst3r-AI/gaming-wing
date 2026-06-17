import type { ReactNode } from "react";

/** A log entry: a stable id and a line of text. */
export interface LogEntry {
  id: string;
  text: string;
}

/** Console-style panel used as a game's "screen" / status area. */
export function GamePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface/60 p-5 shadow-lg shadow-black/20 sm:p-6 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

/** A small stat readout (label + value), e.g. score, round, resources. */
export function Stat({
  label,
  value,
  accentText,
}: {
  label: string;
  value: ReactNode;
  accentText?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/50 px-3 py-2 text-center">
      <p
        className={`font-display text-xl font-bold ${
          accentText ?? "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wide text-faint">{label}</p>
    </div>
  );
}

/** Recent event log. Newest entries first; shows up to `limit`. */
export function EventLog({
  entries,
  limit = 5,
}: {
  entries: LogEntry[];
  limit?: number;
}) {
  const shown = entries.slice(0, limit);
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        <span className="text-teal">● event log</span>
        <span>local session</span>
      </div>
      {shown.length === 0 ? (
        <p className="text-sm text-faint">No events yet.</p>
      ) : (
        <ol className="flex flex-col gap-1.5 text-sm text-muted">
          {shown.map((entry) => (
            <li key={entry.id} className="gw-rise leading-6">
              {entry.text}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** Local browser-save controls: Save / Load / Clear plus a status line. */
export function SaveControls({
  onSave,
  onLoad,
  onClear,
  status,
}: {
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  status?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-border transition-colors hover:bg-surface-3"
        >
          💾 Save
        </button>
        <button
          type="button"
          onClick={onLoad}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          Load
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-faint transition-colors hover:text-rose"
        >
          Clear
        </button>
      </div>
      <p className="text-xs text-faint" role="status" aria-live="polite">
        {status ?? "Browser-only save."}
      </p>
    </div>
  );
}
