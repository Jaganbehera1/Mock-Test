import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set, update, remove, push } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
const database = getDatabase(app);

export interface TestRow {
  id: string;
  title: string;
  subject: string;
  topic: string;
  class_name: string;
  session: string;
  duration_minutes: number;
  prepared_by: string;
  is_active: boolean;
  created_at: string;
}

export interface QuestionRow {
  id: string;
  test_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  image_url?: string | null;
  display_order: number;
  created_at: string;
}

export interface AttemptRow {
  id: string;
  test_id: string;
  student_name: string;
  roll_number: string;
  school_name: string;
  answers: Record<string, string>;
  score: number;
  total_questions: number;
  percentage: number;
  status: "in_progress" | "completed";
  started_at: string;
  completed_at: string | null;
}

type TableName = "tests" | "questions" | "student_attempts";
type Operation = "select" | "insert" | "update" | "delete";
type QueryResult<T> = { data: T[] | T | null; error: Error | null; count?: number };

class FirebaseQuery<T extends Record<string, unknown> = Record<string, unknown>> implements PromiseLike<QueryResult<T>> {
  private operation: Operation = "select";
  private payload: Record<string, unknown> | null = null;
  private filters: Array<[string, unknown]> = [];
  private sort: { column: string; ascending: boolean } | null = null;
  private countRequested = false;
  private headOnly = false;
  private singleRow = false;

  constructor(private readonly table: TableName) {}

  select(columns = "*", options?: { count?: "exact"; head?: boolean }) {
    void columns;
    if (this.operation === "select") this.operation = "select";
    this.countRequested = options?.count === "exact";
    this.headOnly = options?.head === true;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push([column, value]);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.sort = { column, ascending: options?.ascending !== false };
    return this;
  }

  insert(payload: Record<string, unknown>) {
    this.operation = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: Record<string, unknown>) {
    this.operation = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  single() {
    this.singleRow = true;
    return this;
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResult<T>> {
    try {
      if (this.operation === "insert") return await this.create();
      if (this.operation === "update") return await this.modify();
      if (this.operation === "delete") return await this.destroy();
      return await this.read();
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
    }
  }

  private async read() {
    const snapshot = await get(ref(database, this.table));
    const rows = Object.entries(snapshot.val() || {}).map(([id, value]) => ({ id, ...(value as Record<string, unknown>) })) as unknown as T[];
    const filtered = rows.filter((row) => this.filters.every(([column, value]) => row[column] === value));
    if (this.sort) {
      const { column, ascending } = this.sort;
      filtered.sort((left, right) => {
        const a = String(left[column] ?? "");
        const b = String(right[column] ?? "");
        return (a === b ? 0 : a > b ? 1 : -1) * (ascending ? 1 : -1);
      });
    }
    return {
      data: this.headOnly ? null : this.singleRow ? (filtered[0] || null) : filtered,
      error: null,
      ...(this.countRequested ? { count: filtered.length } : {}),
    };
  }

  private async create() {
    const key = push(ref(database, this.table)).key;
    if (!key || !this.payload) throw new Error("Could not create Firebase record");
    const row = { id: key, created_at: new Date().toISOString(), ...this.payload };
    await set(ref(database, `${this.table}/${key}`), row);
    return { data: this.singleRow ? row as unknown as T : null, error: null };
  }

  private async modify() {
    const keys = await this.matchingKeys();
    const changes: Record<string, unknown> = {};
    for (const key of keys) for (const [field, value] of Object.entries(this.payload || {})) changes[`${this.table}/${key}/${field}`] = value;
    if (Object.keys(changes).length) await update(ref(database), changes);
    return { data: null, error: null };
  }

  private async destroy() {
    const keys = await this.matchingKeys();
    await Promise.all(keys.map((key) => remove(ref(database, `${this.table}/${key}`))));
    return { data: null, error: null };
  }

  private async matchingKeys() {
    const snapshot = await get(ref(database, this.table));
    return Object.entries(snapshot.val() || {}).filter(([, value]) => {
      const row = value as Record<string, unknown>;
      return this.filters.every(([column, expected]) => row[column] === expected);
    }).map(([key]) => key);
  }
}

export const firebaseDb = {
  from: (table: TableName) => new FirebaseQuery(table),
};
