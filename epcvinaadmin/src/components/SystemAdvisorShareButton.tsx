"use client";

import { useState } from "react";

type Props = {
  url: string;
  label?: string;
};

export function SystemAdvisorShareButton({ url, label = "Copy share link" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm font-medium text-[color:var(--text)] transition hover:bg-white/10 active:scale-[0.99]"
    >
      {copied ? "Đã copy link" : label}
    </button>
  );
}
