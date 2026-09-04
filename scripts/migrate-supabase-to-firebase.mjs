const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const firebaseUrl = process.env.FIREBASE_DATABASE_URL || "https://mock-test-afbc6-default-rtdb.firebaseio.com";
const firebaseAuth = process.env.FIREBASE_DATABASE_SECRET;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).");
}

const tables = ["tests", "questions", "student_attempts"];
const supabaseHeaders = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
};

async function fetchTable(table) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, { headers: supabaseHeaders });
  if (!response.ok) throw new Error(`Could not export ${table}: ${response.status} ${await response.text()}`);
  return response.json();
}

async function writeTable(table, rows) {
  const payload = Object.fromEntries(rows.map((row) => [row.id, row]));
  const auth = firebaseAuth ? `?auth=${encodeURIComponent(firebaseAuth)}` : "";
  const response = await fetch(`${firebaseUrl}/${table}.json${auth}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Could not import ${table}: ${response.status} ${await response.text()}`);
}

for (const table of tables) {
  const rows = await fetchTable(table);
  await writeTable(table, rows);
  console.log(`Migrated ${rows.length} ${table}.`);
}

console.log("Supabase data migration completed.");