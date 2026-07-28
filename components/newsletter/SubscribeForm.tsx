"use client";

import { useState, type FormEvent } from "react";

interface Props {
  /** Kit (ConvertKit) form action URL, e.g. https://app.kit.com/forms/1234567/subscriptions */
  action?: string;
}

export default function SubscribeForm({ action }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  // Until the Kit form action is wired, show a tasteful placeholder instead of a dead form.
  if (!action) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-5 py-4 text-sm text-zinc-500">
        Subscriptions open shortly — check back soon.
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-zinc-900 bg-zinc-900 px-5 py-4 text-sm font-medium text-white">
        You’re on the list. Check your inbox to confirm your subscription.
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    try {
      const res = await fetch(action!, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
      form.reset();
    } catch {
      // If the AJAX path is blocked (CORS/network), fall back to a normal
      // form POST, which navigates to Kit's hosted confirmation page.
      form.submit();
    }
  }

  return (
    <form
      action={action}
      method="post"
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-3"
    >
      <input
        type="email"
        name="email_address"
        required
        placeholder="you@email.com"
        autoComplete="email"
        className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900 placeholder:text-zinc-400"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
