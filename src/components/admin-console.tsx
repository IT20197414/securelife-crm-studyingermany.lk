"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createId, formatMoney } from "@/lib/crm-data";
import { useCrmStore } from "@/lib/use-crm-store";
import { CRMUser, LeadStatus, Plan, UserRole } from "@/lib/types";

const statusOptions: LeadStatus[] = [
  "New",
  "Contacted",
  "Follow-up",
  "Interested",
  "Enrolled",
  "Lost",
];

const roleOptions: UserRole[] = ["Admin", "Advisor"];
const tabs = ["dashboard", "leads", "plans", "users"] as const;
type AdminTab = (typeof tabs)[number];

function badgeClasses(status: LeadStatus) {
  switch (status) {
    case "New":
      return "bg-sky-100 text-sky-800";
    case "Contacted":
      return "bg-amber-100 text-amber-800";
    case "Follow-up":
      return "bg-violet-100 text-violet-800";
    case "Interested":
      return "bg-emerald-100 text-emerald-800";
    case "Enrolled":
      return "bg-cyan-100 text-cyan-800";
    case "Lost":
      return "bg-rose-100 text-rose-800";
  }
}

export function AdminConsole() {
  const crm = useCrmStore();
  const { state } = crm;
  const session = state.session;

  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [loginEmail, setLoginEmail] = useState("admin@securelife.lk");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [leadNote, setLeadNote] = useState("");
  const [planDraft, setPlanDraft] = useState<Plan>({
    id: "",
    name: "Basic",
    tier: "",
    description: "",
    coverageAmount: 0,
    premium: 0,
    minAge: 18,
    maxAge: 60,
    policyTerm: "",
    benefits: [""],
    tone: "emerald",
  });
  const [userDraft, setUserDraft] = useState<CRMUser>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "Advisor",
  });

  const safeSelectedLeadId = useMemo(() => {
    if (selectedLeadId && state.leads.some((lead) => lead.id === selectedLeadId)) {
      return selectedLeadId;
    }
    return state.leads[0]?.id ?? "";
  }, [selectedLeadId, state.leads]);

  const selectedLead = useMemo(
    () => state.leads.find((lead) => lead.id === safeSelectedLeadId) ?? null,
    [safeSelectedLeadId, state.leads],
  );

  const selectedAdvisorName = (advisorId: string | null) =>
    state.users.find((user) => user.id === advisorId)?.name ?? "Unassigned";

  const stats = useMemo(() => {
    const total = state.leads.length;
    const newCount = state.leads.filter((lead) => lead.status === "New").length;
    const activeCount = state.leads.filter((lead) =>
      ["Contacted", "Follow-up", "Interested"].includes(lead.status),
    ).length;
    const enrolledCount = state.leads.filter((lead) => lead.status === "Enrolled").length;

    return { total, newCount, activeCount, enrolledCount };
  }, [state.leads]);

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h3 className="text-2xl font-semibold text-slate-950">Admin Login</h3>
          <p className="mt-2 text-sm text-slate-600">
            Use the demo account to manage leads, plans, and users.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const result = crm.login(loginEmail, loginPassword);
              if (!result.ok) {
                alert(result.message);
              }
            }}
          >
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-cyan-400 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-cyan-400 focus:ring-2"
              />
            </label>
            <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white">
              Log in
            </button>
          </form>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold">Demo credentials</p>
            <p>admin@securelife.lk / admin123</p>
            <p>advisor1@securelife.lk / advisor123</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePlanSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const benefits = planDraft.benefits.filter(Boolean);
    crm.savePlan({
      ...planDraft,
      id: planDraft.id || createId("plan"),
      benefits,
    });
    setPlanDraft({
      id: "",
      name: "Basic",
      tier: "",
      description: "",
      coverageAmount: 0,
      premium: 0,
      minAge: 18,
      maxAge: 60,
      policyTerm: "",
      benefits: [""],
      tone: "emerald",
    });
  };

  const handleUserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    crm.saveUser({
      ...userDraft,
      id: userDraft.id || createId("user"),
    });
    setUserDraft({
      id: "",
      name: "",
      email: "",
      password: "",
      role: "Advisor",
    });
  };

  const leadColumns = state.leads.map((lead) => ({
    ...lead,
    advisorName: selectedAdvisorName(lead.assignedUserId),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Logged in as</p>
          <h3 className="text-lg font-semibold text-slate-950">
            {session.name} - {session.role}
          </h3>
        </div>
        <div className="flex gap-2">
          <Link
            href="/quote"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            View Lead Form
          </Link>
          <button
            onClick={crm.resetDemoData}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Reset Demo Data
          </button>
          <button
            onClick={crm.logout}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total leads" value={stats.total} />
        <StatCard label="New leads" value={stats.newCount} />
        <StatCard label="Active pipeline" value={stats.activeCount} />
        <StatCard label="Enrolled" value={stats.enrolledCount} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              tab === item
                ? "bg-cyan-400 text-slate-950"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <Panel title="Sales pipeline">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statusOptions.map((status) => (
                <div key={status} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">{status}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {state.leads.filter((lead) => lead.status === status).length}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Advisor workload">
            <div className="space-y-3">
              {state.users
                .filter((user) => user.role === "Advisor")
                .map((advisor) => {
                  const assigned = state.leads.filter((lead) => lead.assignedUserId === advisor.id);
                  return (
                    <div key={advisor.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{advisor.name}</p>
                          <p className="text-sm text-slate-500">{advisor.email}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                          {assigned.length} leads
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Panel>
        </div>
      )}

      {tab === "leads" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Lead sheet">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Advisor</th>
                  </tr>
                </thead>
                <tbody>
                  {leadColumns.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`cursor-pointer border-t border-slate-100 transition hover:bg-cyan-50 ${
                      safeSelectedLeadId === lead.id ? "bg-cyan-50" : "bg-white"
                    }`}
                  >
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-950">{lead.fullName}</p>
                        <p className="text-slate-500">{lead.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(
                            lead.status,
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{lead.advisorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Lead details">
            {selectedLead ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-lg font-semibold text-slate-950">{selectedLead.fullName}</p>
                  <p className="text-sm text-slate-500">
                    {selectedLead.email} - {selectedLead.phone}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Source: {selectedLead.source} - Age: {selectedLead.age}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
                  <select
                    value={selectedLead.status}
                    onChange={(event) =>
                      crm.updateLead(selectedLead.id, {
                        status: event.target.value as LeadStatus,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Assign advisor</span>
                  <select
                    value={selectedLead.assignedUserId ?? ""}
                    onChange={(event) =>
                      crm.updateLead(selectedLead.id, {
                        assignedUserId: event.target.value || null,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    <option value="">Unassigned</option>
                    {state.users
                      .filter((user) => user.role === "Advisor")
                      .map((advisor) => (
                        <option key={advisor.id} value={advisor.id}>
                          {advisor.name}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Add note</span>
                  <textarea
                    value={leadNote}
                    onChange={(event) => setLeadNote(event.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Call outcome, next step, or customer note"
                  />
                </label>

                <button
                  onClick={() => {
                    crm.addLeadNote(selectedLead.id, leadNote);
                    setLeadNote("");
                  }}
                  className="rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white"
                >
                  Save note
                </button>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Notes</p>
                  <div className="space-y-2">
                    {selectedLead.notes.length ? (
                      selectedLead.notes.map((note) => (
                        <div key={note} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                          {note}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No notes yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Select a lead to see details.</p>
            )}
          </Panel>
        </div>
      )}

      {tab === "plans" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Create or edit plan">
            <form className="grid gap-4" onSubmit={handlePlanSubmit}>
              <input
                value={planDraft.id}
                onChange={(e) => setPlanDraft({ ...planDraft, id: e.target.value })}
                placeholder="Plan id (optional)"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={planDraft.name}
                onChange={(e) => setPlanDraft({ ...planDraft, name: e.target.value })}
                placeholder="Plan name"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={planDraft.tier}
                onChange={(e) => setPlanDraft({ ...planDraft, tier: e.target.value })}
                placeholder="Tier label"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <textarea
                value={planDraft.description}
                onChange={(e) => setPlanDraft({ ...planDraft, description: e.target.value })}
                placeholder="Description"
                rows={4}
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={planDraft.coverageAmount}
                  onChange={(e) =>
                    setPlanDraft({ ...planDraft, coverageAmount: Number(e.target.value) })
                  }
                  placeholder="Coverage"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  type="number"
                  value={planDraft.premium}
                  onChange={(e) => setPlanDraft({ ...planDraft, premium: Number(e.target.value) })}
                  placeholder="Premium"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  type="number"
                  value={planDraft.minAge}
                  onChange={(e) => setPlanDraft({ ...planDraft, minAge: Number(e.target.value) })}
                  placeholder="Min age"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  type="number"
                  value={planDraft.maxAge}
                  onChange={(e) => setPlanDraft({ ...planDraft, maxAge: Number(e.target.value) })}
                  placeholder="Max age"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>
              <input
                value={planDraft.policyTerm}
                onChange={(e) => setPlanDraft({ ...planDraft, policyTerm: e.target.value })}
                placeholder="Policy term"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <select
                value={planDraft.tone}
                onChange={(e) =>
                  setPlanDraft({ ...planDraft, tone: e.target.value as Plan["tone"] })
                }
                className="rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="emerald">Emerald</option>
                <option value="amber">Amber</option>
                <option value="rose">Rose</option>
              </select>
              <textarea
                value={planDraft.benefits.join("\n")}
                onChange={(e) =>
                  setPlanDraft({
                    ...planDraft,
                    benefits: e.target.value.split("\n"),
                  })
                }
                rows={4}
                placeholder="One benefit per line"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <button className="rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white">
                Save plan
              </button>
            </form>
          </Panel>

          <Panel title="Current plans">
            <div className="space-y-3">
              {state.plans.map((plan) => (
                <div key={plan.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{plan.name}</p>
                      <p className="text-sm text-slate-500">{plan.tier}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPlanDraft(plan)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => crm.deletePlan(plan.id)}
                        className="rounded-full border border-rose-200 px-3 py-1 text-sm text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    Coverage {formatMoney(plan.coverageAmount)} - Premium {formatMoney(plan.premium)}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === "users" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Create or edit user">
            <form className="grid gap-4" onSubmit={handleUserSubmit}>
              <input
                value={userDraft.id}
                onChange={(e) => setUserDraft({ ...userDraft, id: e.target.value })}
                placeholder="User id (optional)"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={userDraft.name}
                onChange={(e) => setUserDraft({ ...userDraft, name: e.target.value })}
                placeholder="Name"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={userDraft.email}
                onChange={(e) => setUserDraft({ ...userDraft, email: e.target.value })}
                placeholder="Email"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={userDraft.password}
                onChange={(e) => setUserDraft({ ...userDraft, password: e.target.value })}
                placeholder="Password"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <select
                value={userDraft.role}
                onChange={(e) => setUserDraft({ ...userDraft, role: e.target.value as UserRole })}
                className="rounded-2xl border border-slate-200 px-4 py-3"
              >
                {roleOptions.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
              <button className="rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white">
                Save user
              </button>
            </form>
          </Panel>

          <Panel title="Users and roles">
            <div className="space-y-3">
              {state.users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
