"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildDefaultState,
  createId,
  STORAGE_KEY,
} from "./crm-data";
import { CRMState, CRMUser, Lead, Plan, Session } from "./types";

function readStoredState(): CRMState {
  if (typeof window === "undefined") {
    return buildDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultState();
    const parsed = JSON.parse(raw) as CRMState;
    return {
      ...buildDefaultState(),
      ...parsed,
      session: parsed.session ?? null,
    };
  } catch {
    return buildDefaultState();
  }
}

export function useCrmStore() {
  const [state, setState] = useState<CRMState>(() =>
    typeof window === "undefined" ? buildDefaultState() : readStoredState(),
  );
  const ready = useRef(false);

  useEffect(() => {
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const advisors = useMemo(
    () => state.users.filter((user) => user.role === "Advisor"),
    [state.users],
  );

  const addLead = (input: Omit<Lead, "id" | "status" | "assignedUserId" | "recommendedPlanId" | "notes" | "createdAt">) => {
    const recommended = state.plans.find((plan) => plan.name === input.interestedPlan);
    const assigned = advisors[0] ?? null;

    setState((prev) => ({
      ...prev,
      leads: [
        {
          id: createId("lead"),
          ...input,
          status: "New",
          assignedUserId: assigned?.id ?? null,
          recommendedPlanId: recommended?.id ?? null,
          notes: [],
          createdAt: new Date().toISOString(),
        },
        ...prev.leads,
      ],
    }));
  };

  const updateLead = (leadId: string, patch: Partial<Lead>) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) => (lead.id === leadId ? { ...lead, ...patch } : lead)),
    }));
  };

  const addLeadNote = (leadId: string, note: string) => {
    if (!note.trim()) return;
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === leadId
          ? { ...lead, notes: [note.trim(), ...lead.notes] }
          : lead,
      ),
    }));
  };

  const savePlan = (plan: Plan) => {
    setState((prev) => {
      const exists = prev.plans.some((item) => item.id === plan.id);
      return {
        ...prev,
        plans: exists
          ? prev.plans.map((item) => (item.id === plan.id ? plan : item))
          : [plan, ...prev.plans],
      };
    });
  };

  const deletePlan = (planId: string) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.filter((plan) => plan.id !== planId),
      leads: prev.leads.map((lead) =>
        lead.recommendedPlanId === planId ? { ...lead, recommendedPlanId: null } : lead,
      ),
    }));
  };

  const saveUser = (user: CRMUser) => {
    setState((prev) => {
      const exists = prev.users.some((item) => item.id === user.id);
      return {
        ...prev,
        users: exists
          ? prev.users.map((item) => (item.id === user.id ? user : item))
          : [user, ...prev.users],
      };
    });
  };

  const login = (email: string, password: string) => {
    const user = state.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
    );

    if (!user) return { ok: false, message: "Invalid email or password." };

    const session: Session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    setState((prev) => ({ ...prev, session }));
    return { ok: true, session };
  };

  const logout = () => {
    setState((prev) => ({ ...prev, session: null }));
  };

  const resetDemoData = () => {
    setState(buildDefaultState());
  };

  return {
    state,
    advisors,
    addLead,
    updateLead,
    addLeadNote,
    savePlan,
    deletePlan,
    saveUser,
    login,
    logout,
    resetDemoData,
  };
}

export type CrmStore = ReturnType<typeof useCrmStore>;
