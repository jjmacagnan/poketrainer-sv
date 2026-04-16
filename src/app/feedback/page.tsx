"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n";

type Status = "idle" | "submitting" | "success" | "error";

const CATEGORIES = ["bug", "suggestion", "improvement", "other"] as const;
const TOOLS = [
  "general",
  "sandwich-builder",
  "ev-pokedex",
  "ev-tracker",
  "raid-builder",
  "nature-calc",
] as const;

export default function FeedbackPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [category, setCategory] = useState("");
  const [tool, setTool] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!process.env.NEXT_PUBLIC_WEB3FORMS_KEY) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `[PokéTrainer SV] ${t(`feedback.category_${category}`)} — ${t(`feedback.tool_${tool}`)}`,
          from_name: "PokéTrainer SV Feedback",
          category: t(`feedback.category_${category}`),
          tool: t(`feedback.tool_${tool}`),
          message,
          reply_to: email || undefined,
          botcheck: "",
        }),
      });

      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setCategory("");
    setTool("");
    setMessage("");
    setEmail("");
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4 py-16">
        <div className="animate-fade-up w-full rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h2 className="mb-2 font-[family-name:var(--font-syne)] text-2xl font-extrabold leading-normal text-white">
            {t("feedback.successTitle")}
          </h2>
          <p className="mb-6 text-sm text-gray-400">{t("feedback.successBody")}</p>
          <button
            onClick={reset}
            className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            {t("feedback.sendAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      {/* Header */}
      <div className="animate-fade-up mb-10 text-center">
        <div className="mb-2 text-5xl">💬</div>
        <h1
          className="mb-2 font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight"
          style={{
            background: "linear-gradient(135deg, #22D3EE, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            paddingBottom: "0.1em",
          }}
        >
          {t("feedback.title")}
        </h1>
        <p className="text-sm text-gray-500">{t("feedback.subtitle")}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-up flex flex-col gap-5"
        style={{ animationDelay: "80ms" }}
      >
        {/* Category + Tool row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("feedback.category")}
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition-colors focus:border-white/30 focus:outline-none"
            >
              <option value="" disabled>—</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`feedback.category_${c}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("feedback.tool")}
            </label>
            <select
              required
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition-colors focus:border-white/30 focus:outline-none"
            >
              <option value="" disabled>—</option>
              {TOOLS.map((tc) => (
                <option key={tc} value={tc}>
                  {t(`feedback.tool_${tc}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t("feedback.message")}
          </label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("feedback.messagePlaceholder")}
            className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 transition-colors focus:border-white/30 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t("feedback.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("feedback.emailPlaceholder")}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 transition-colors focus:border-white/30 focus:outline-none"
          />
        </div>

        {/* Honeypot */}
        <input type="checkbox" name="botcheck" className="hidden" />

        {status === "error" && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {t("feedback.errorBody")}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? t("feedback.submitting") : t("feedback.submit")}
        </button>
      </form>
    </div>
  );
}
