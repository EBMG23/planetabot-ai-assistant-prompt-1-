"use client";

import { useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  value: string;
  kind?: "text" | "audio" | "tip" | "link" | "full";
  slug?: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: "sm" | "md";
  tone?: "brand" | "ink" | "ghost";
};

async function writeClipboard(value: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fallback abajo */
  }
  try {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({
  value,
  kind = "text",
  slug,
  label = "Copiar",
  copiedLabel = "¡Copiado!",
  className = "",
  size = "md",
  tone = "brand",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    const ok = await writeClipboard(value);
    if (!ok) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1700);
    void fetch("/api/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, categorySlug: slug }),
    }).catch(() => undefined);
  }

  const tones: Record<string, string> = {
    brand: copied
      ? "bg-leaf text-white border-leaf"
      : "bg-brand text-white border-brand hover:bg-brand-deep hover:border-brand-deep",
    ink: copied
      ? "bg-leaf text-white border-leaf"
      : "bg-ink text-paper border-ink hover:bg-ink-3",
    ghost: copied
      ? "border-leaf text-leaf bg-leaf/10"
      : "border-line bg-card text-ink hover:border-brand hover:text-brand",
  };

  const sizes: Record<string, string> = {
    sm: "px-2.5 py-1 text-[11px] gap-1.5",
    md: "px-3.5 py-2 text-xs gap-2",
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded-full border font-bold uppercase tracking-[0.08em] transition-all duration-200 active:scale-[0.96] ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {copied ? (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6">
          <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="7" y="7" width="9" height="10" rx="2" />
          <path d="M13 4.5H5.5A1.5 1.5 0 004 6v7" strokeLinecap="round" />
        </svg>
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
