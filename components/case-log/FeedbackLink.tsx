"use client";

import { useState } from "react";
import { Card } from "./ui";

/**
 * Shown only to the PIN holder. The whole point is to be copied, so the URL is
 * selectable text with a button rather than a link you would have to right-click.
 */
export default function FeedbackLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the text is selectable either way.
      setCopied(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-lg font-bold">
          Feedback link for your casers
        </h3>
        <span className="text-xs text-zinc-400">Only you can see this</span>
      </div>
      <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
        Send this to whoever cased you. They score you and write their feedback;
        it lands here as a new entry. No PIN needed on their side, and the same
        link works for everyone, every time.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
          {url}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
        Treat it like a password: anyone holding it can add an entry. Changing
        CASELOG_SECRET retires the old link.
      </p>
    </Card>
  );
}
