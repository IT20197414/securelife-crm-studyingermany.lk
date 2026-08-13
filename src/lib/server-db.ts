import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { buildDefaultState } from "./crm-data";
import { CRMState, CRMUser, Lead, Plan, Session } from "./types";

const dataDir = path.join(process.cwd(), ".data");
const dbFile = path.join(dataDir, "securelife-crm.sqlite");

type PlanRow = Omit<Plan, "coverageAmount" | "minAge" | "maxAge" | "benefits"> & {
  coverage_amount: number;
  min_age: number;
  max_age: number;
  benefits: string;
};

type LeadRow = Omit<
  Lead,
  "fullName" | "interestedPlan" | "assignedUserId" | "recommendedPlanId" | "notes" | "createdAt"
> & {
  full_name: string;
  interested_plan: string;
  assigned_user_id: string | null;
  recommended_plan_id: string | null;
  notes: string;
  created_at: string;
};

type SessionRow = Session | undefined;

let db: Database.Database | null = null;

function parseJsonList(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getDb() {
  if (db) return db;

  mkdirSync(dataDir, { recursive: true });
  db = new Database(dbFile);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initializeSchema(db);
  seedIfEmpty(db);
  return db;
}

function initializeSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tier TEXT NOT NULL,
      description TEXT NOT NULL,
      coverage_amount INTEGER NOT NULL,
      premium INTEGER NOT NULL,
      min_age INTEGER NOT NULL,
      max_age INTEGER NOT NULL,
      policyTerm TEXT NOT NULL,
      benefits TEXT NOT NULL,
      tone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      age INTEGER NOT NULL,
      interested_plan TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      assigned_user_id TEXT,
      recommended_plan_id TEXT,
      notes TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (assigned_user_id) REFERENCES users(id),
      FOREIGN KEY (recommended_plan_id) REFERENCES plans(id)
    );

    CREATE TABLE IF NOT EXISTS app_session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `);
}

function seedIfEmpty(database: Database.Database) {
  const row = database.prepare("SELECT COUNT(*) as count FROM plans").get() as { count: number };
  if (row.count > 0) return;
  writeStateToDb(database, buildDefaultState());
}

function writeStateToDb(database: Database.Database, state: CRMState) {
  const insertPlan = database.prepare(`
    INSERT INTO plans (
      id, name, tier, description, coverage_amount, premium, min_age, max_age,
      policyTerm, benefits, tone
    ) VALUES (
      @id, @name, @tier, @description, @coverageAmount, @premium, @minAge, @maxAge,
      @policyTerm, @benefitsJson, @tone
    )
  `);

  const insertUser = database.prepare(`
    INSERT INTO users (id, name, email, password, role)
    VALUES (@id, @name, @email, @password, @role)
  `);

  const insertLead = database.prepare(`
    INSERT INTO leads (
      id, full_name, phone, email, age, interested_plan, source, status,
      assigned_user_id, recommended_plan_id, notes, created_at
    ) VALUES (
      @id, @fullName, @phone, @email, @age, @interestedPlan, @source, @status,
      @assignedUserId, @recommendedPlanId, @notesJson, @createdAt
    )
  `);

  const insertSession = database.prepare(`
    INSERT INTO app_session (id, userId, name, email, role)
    VALUES (1, @userId, @name, @email, @role)
  `);

  const transaction = database.transaction(() => {
    database.prepare("DELETE FROM app_session").run();
    database.prepare("DELETE FROM leads").run();
    database.prepare("DELETE FROM users").run();
    database.prepare("DELETE FROM plans").run();

    state.plans.forEach((plan) =>
      insertPlan.run({
        ...plan,
        benefitsJson: JSON.stringify(plan.benefits),
      }),
    );
    state.users.forEach((user) => insertUser.run(user));
    state.leads.forEach((lead) =>
      insertLead.run({
        ...lead,
        notesJson: JSON.stringify(lead.notes),
      }),
    );
    if (state.session) {
      insertSession.run(state.session);
    }
  });

  transaction();
}

export function readDatabaseState(): CRMState {
  const database = getDb();
  const plans = (database.prepare("SELECT * FROM plans").all() as PlanRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    tier: row.tier,
    description: row.description,
    coverageAmount: row.coverage_amount,
    premium: row.premium,
    minAge: row.min_age,
    maxAge: row.max_age,
    policyTerm: row.policyTerm,
    benefits: parseJsonList(row.benefits),
    tone: row.tone as Plan["tone"],
  }));

  const users = database.prepare("SELECT * FROM users").all() as CRMUser[];
  const leads = (database.prepare("SELECT * FROM leads ORDER BY created_at DESC").all() as LeadRow[]).map(
    (row) => ({
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email,
      age: row.age,
      interestedPlan: row.interested_plan,
      source: row.source as Lead["source"],
      status: row.status as Lead["status"],
      assignedUserId: row.assigned_user_id,
      recommendedPlanId: row.recommended_plan_id,
      notes: parseJsonList(row.notes),
      createdAt: row.created_at,
    }),
  );
  const session = database.prepare("SELECT userId, name, email, role FROM app_session WHERE id = 1").get() as
    | SessionRow
    | undefined;

  return {
    plans,
    leads,
    users,
    session: session ?? null,
  };
}

export function writeDatabaseState(state: CRMState) {
  const database = getDb();
  writeStateToDb(database, state);
  return readDatabaseState();
}
