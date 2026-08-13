"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { formatMoney, recommendPlan } from "@/lib/crm-data";
import { useCrmStore } from "@/lib/use-crm-store";
import { LeadSource } from "@/lib/types";

const sources: LeadSource[] = ["Website Quote", "Talk to Advisor"];

export default function QuotePage() {
  const crm = useCrmStore();
  const [source, setSource] = useState<LeadSource>("Website Quote");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    interestedPlan: "Basic",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const planMatch = useMemo(() => {
    const age = Number(form.age || 0);
    return age > 0 ? recommendPlan(age, crm.state.plans) : crm.state.plans[0];
  }, [crm.state.plans, form.age]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          age: Number(form.age),
          interestedPlan: form.interestedPlan,
          source,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead could not be saved.");
      }

      setSubmitted(true);
      setSubmittedName(form.fullName);
      setForm({
        fullName: "",
        phone: "",
        email: "",
        age: "",
        interestedPlan: "Basic",
      });
      setSource("Website Quote");
    } catch {
      setError("Sorry, the lead could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SiteShell title="Get a Free Quote" subtitle="Lead generation form connected to the CRM">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex gap-2">
            {sources.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSource(item);
                  if (item === "Talk to Advisor") {
                    document.getElementById("advisor-help")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  source === item
                    ? "border border-cyan-300 bg-cyan-400 text-slate-950"
                    : "border border-slate-300 bg-white text-slate-950"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {source === "Talk to Advisor" && (
            <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
                Advisor request selected
              </p>
              <p className="mt-2 text-sm text-slate-700">
                This will be treated as a direct advisor callback request and highlighted in the CRM.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </Field>
            <Field label="Phone">
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </Field>
            <Field label="Age">
              <input
                required
                type="number"
                min="18"
                max="65"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </Field>
          </div>

          <Field label="Interested plan">
            <select
              value={form.interestedPlan}
              onChange={(e) => setForm({ ...form, interestedPlan: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {crm.state.plans.map((plan) => (
                <option key={plan.id}>{plan.name}</option>
              ))}
            </select>
          </Field>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Suggested plan
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{planMatch.name}</p>
            <p className="mt-1 text-sm text-slate-600">{planMatch.description}</p>
            <p className="mt-2 text-sm text-slate-500">
              {formatMoney(planMatch.coverageAmount)} cover - {formatMoney(planMatch.premium)} premium
            </p>
          </div>

          <button
            disabled={isSaving}
            className="mt-6 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-sm disabled:cursor-wait disabled:opacity-70"
          >
            {isSaving
              ? "Saving lead..."
              : source === "Talk to Advisor"
                ? "Request advisor follow-up"
                : "Submit and save as lead"}
          </button>

          {submitted && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              Thanks, {submittedName}. Your request is now stored in the CRM as a new lead.
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
              {error}
            </div>
          )}
        </form>

        <div
          id="advisor-help"
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm scroll-mt-24"
        >
          <h3 className="text-2xl font-semibold text-slate-950">
            {source === "Talk to Advisor" ? "Talk to an Advisor" : "What happens next?"}
          </h3>
          {source === "Talk to Advisor" ? (
            <div className="mt-5 space-y-4">
              <p className="text-sm leading-7 text-slate-600">
                This option means the lead should be treated as a direct advisor request.
                The CRM will capture it the same way, but the advisor follows up first.
              </p>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Advisor follow-up
                </p>
                <p className="mt-2 text-sm text-slate-700">The assigned advisor will call or message the lead.</p>
                <p className="mt-1 text-sm text-slate-700">Best for people who want help choosing a plan.</p>
              </div>

              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
                  Example contact
                </p>
                <p className="mt-2 text-sm text-slate-700">Advisor desk: +94 11 234 5678</p>
                <p className="text-sm text-slate-700">Email: advisor@securelife.lk</p>
              </div>
            </div>
          ) : (
            <>
              <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <li>1. The form submission becomes a lead.</li>
                <li>2. An advisor is assigned automatically.</li>
                <li>3. The lead appears inside the CRM dashboard.</li>
                <li>4. The advisor can call, follow up, and update the status.</li>
                <li>5. Management can track the full sales pipeline.</li>
              </ol>

              <div className="mt-8 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Demo note
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  This assignment version stores leads in the local SQLite-backed CRM database.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/admin" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-sm">
                  Open CRM
                </Link>
                <Link href="/plans" className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-950 shadow-sm">
                  View plans
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
