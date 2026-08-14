"use client";

import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { formatMoney } from "@/lib/crm-data";
import { useCrmStore } from "@/lib/use-crm-store";

export default function HomePage() {
  const { state } = useCrmStore();
  const plans = state.plans;

  return (
    <SiteShell title="Insurance CRM" subtitle="Public website + lead workflow">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-950/10">
            <p className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-900">
              Public site connected to CRM
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Find a life insurance plan that fits your next step.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Compare cover options, request a free quote, or ask an advisor to
              help you choose the right SecureLife plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-sm"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/plans"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-950 shadow-sm"
              >
                Compare Plans
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Free quote", "Fast request"],
                ["Plan options", plans.length.toString()],
                ["Advisor help", "Available"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
                Start here
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">Compare plans</p>
                  <p className="mt-1">Review Basic, Gold, and Premium cover options.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">Get a free quote</p>
                  <p className="mt-1">Submit your details and preferred plan in a simple form.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">Talk to an advisor</p>
                  <p className="mt-1">Request a callback if you want help choosing a plan.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Need support?
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Use the quote form to request a plan estimate.</p>
                <p>Select Talk to Advisor if you prefer a guided callback.</p>
              </div>
              <p className="mt-5 text-sm text-slate-400">
                CRM access is reserved for authorized SecureLife staff.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Capture leads",
              copy: "A visitor submits a quote or advisor request and becomes a lead inside the CRM.",
            },
            {
              title: "Assign advisors",
              copy: "The admin can route each lead to an advisor, then track status and notes.",
            },
            {
              title: "Match plans",
              copy: "The system recommends Basic, Gold, or Premium based on age and eligibility.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
                Featured plans
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-950">
                Plans ready to compare
              </h3>
            </div>
            <Link href="/plans" className="text-sm font-semibold text-cyan-700">
              View all plans
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{plan.tier}</p>
                    <h4 className="text-2xl font-semibold text-slate-950">{plan.name}</h4>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {plan.minAge}-{plan.maxAge}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>
                <p className="mt-4 text-sm font-semibold text-slate-950">
                  {formatMoney(plan.coverageAmount)} cover - {formatMoney(plan.premium)} premium
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
