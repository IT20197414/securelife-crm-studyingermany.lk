"use client";

import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { formatMoney } from "@/lib/crm-data";
import { useCrmStore } from "@/lib/use-crm-store";

const toneStyles = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

export default function PlansPage() {
  const { state } = useCrmStore();

  return (
    <SiteShell title="Insurance Plans" subtitle="Compare the available plans">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {state.plans.map((plan) => (
            <article key={plan.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${toneStyles[plan.tone]}`}>
                {plan.tier}
              </span>
              <h3 className="mt-4 text-3xl font-semibold text-slate-950">{plan.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{plan.description}</p>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Coverage</p>
                <p className="text-2xl font-semibold text-slate-950">
                  {formatMoney(plan.coverageAmount)}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Premium {formatMoney(plan.premium)} - Term {plan.policyTerm}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Benefits
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Eligibility: ages {plan.minAge} to {plan.maxAge}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/quote" className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white">
            Get a Free Quote
          </Link>
          <Link href="/admin" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700">
            Open CRM
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
