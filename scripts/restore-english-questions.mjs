import fs from "node:fs";

const databaseUrl = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;
const databaseSecret = process.env.FIREBASE_DATABASE_SECRET;
const testId = process.env.FIREBASE_ENGLISH_TEST_ID || "110b9c01-e2ec-4bfa-9e92-8aa49778de93";

if (!databaseUrl) {
  throw new Error("Set FIREBASE_DATABASE_URL or VITE_FIREBASE_DATABASE_URL.");
}

const source = fs.readFileSync(new URL("../src/questions.ts", import.meta.url), "utf8")
  .replace(/export interface Question \{[\s\S]*?\}\n\n/, "")
  .replace(/export const questions: Question\[\] =/, "const questions =");
const module = await import(`data:text/javascript;base64,${Buffer.from(`${source}\nexport { questions };`).toString("base64")}`);
const questions = module.questions;

if (questions.length !== 100) {
  throw new Error(`Expected 100 English questions, found ${questions.length}.`);
}

const auth = databaseSecret ? `?auth=${encodeURIComponent(databaseSecret)}` : "";
const collectionUrl = `${databaseUrl}/questions.json${auth}`;
const existingResponse = await fetch(collectionUrl);
if (!existingResponse.ok) throw new Error(`Could not read Firebase questions: ${existingResponse.status}`);
const existing = await existingResponse.json() || {};
const createdAt = new Date().toISOString();

for (const question of questions) {
  const id = `english-${String(question.id).padStart(3, "0")}`;
  existing[id] = {
    id,
    test_id: testId,
    question_text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    correct_answer: ["A", "B", "C", "D"][question.correctAnswer],
    display_order: question.id,
    created_at: existing[id]?.created_at || createdAt,
  };
}

const writeResponse = await fetch(collectionUrl, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(existing),
});
if (!writeResponse.ok) throw new Error(`Could not restore Firebase questions: ${writeResponse.status} ${await writeResponse.text()}`);

console.log(`Restored ${questions.length} English questions to test ${testId}.`);