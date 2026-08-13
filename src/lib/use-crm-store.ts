"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildDefaultState, createId, defaultUsers } from "./crm-data";
import { CRMState, CRMUser, Lead, Plan, Session } from "./types";

const SYNC_CHANNEL = "securelife-crm-sync";

async function readRemoteState(): Promise<CRMState> {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) {
      return buildDefaultState();
    }
    return (await response.json()) as CRMState;
  } catch {
    return buildDefaultState();
  }
}

export function useCrmStore(initialState?: CRMState) {
  const [state, setState] = useState<CRMState>(initialState ?? buildDefaultState());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const hasLocalChanges = useRef(false);

  useEffect(() => {
    let mounted = true;
    void readRemoteState().then((remote) => {
      if (mounted && !hasLocalChanges.current) {
        setState(remote);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(SYNC_CHANNEL);
    channelRef.current = channel;
    const handleSync = () => {
      void readRemoteState().then((remote) => setState(remote));
    };

    channel.addEventListener("message", handleSync);
    return () => {
      channel.removeEventListener("message", handleSync);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const pushState = async (nextState: CRMState) => {
    hasLocalChanges.current = true;
    setState(nextState);
    await fetch("/api/state", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextState),
    }).catch(() => {
      // The demo should keep working even if the backend save fails temporarily.
    });
    channelRef.current?.postMessage("sync");
  };

  const advisors = useMemo(
    () => state.users.filter((user) => user.role === "Advisor"),
    [state.users],
  );

  const addLead = async (
    input: Omit<
      Lead,
      "id" | "status" | "assignedUserId" | "recommendedPlanId" | "notes" | "createdAt"
    >,
  ) => {
    const recommended = state.plans.find((plan) => plan.name === input.interestedPlan);
    const assigned = advisors[0] ?? null;

    await pushState({
      ...state,
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
        ...state.leads,
      ],
    });
  };

  const updateLead = (leadId: string, patch: Partial<Lead>) => {
    void pushState({
      ...state,
      leads: state.leads.map((lead) => (lead.id === leadId ? { ...lead, ...patch } : lead)),
    });
  };

  const addLeadNote = (leadId: string, note: string) => {
    if (!note.trim()) return;
    void pushState({
      ...state,
      leads: state.leads.map((lead) =>
        lead.id === leadId ? { ...lead, notes: [note.trim(), ...lead.notes] } : lead,
      ),
    });
  };

  const savePlan = (plan: Plan) => {
    const exists = state.plans.some((item) => item.id === plan.id);
    void pushState({
      ...state,
      plans: exists
        ? state.plans.map((item) => (item.id === plan.id ? plan : item))
        : [plan, ...state.plans],
    });
  };

  const deletePlan = (planId: string) => {
    void pushState({
      ...state,
      plans: state.plans.filter((plan) => plan.id !== planId),
      leads: state.leads.map((lead) =>
        lead.recommendedPlanId === planId ? { ...lead, recommendedPlanId: null } : lead,
      ),
    });
  };

  const saveUser = (user: CRMUser) => {
    const exists = state.users.some((item) => item.id === user.id);
    void pushState({
      ...state,
      users: exists
        ? state.users.map((item) => (item.id === user.id ? user : item))
        : [user, ...state.users],
    });
  };

  const login = async (email: string, password: string) => {
    const users = state.users?.length ? state.users : defaultUsers;
    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
    );

    if (!user) return { ok: false, message: "Invalid email or password." };

    const session: Session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    await pushState({ ...state, session });
    return { ok: true, session };
  };

  const logout = () => {
    void pushState({ ...state, session: null });
  };

  const resetDemoData = () => {
    void pushState(buildDefaultState());
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
