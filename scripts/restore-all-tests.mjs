import fs from "node:fs";

const databaseUrl = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;
const databaseSecret = process.env.FIREBASE_DATABASE_SECRET;
const englishTestId = "english_resources_test";
const geographyTestId = "geography_resources_test";

if (!databaseUrl) throw new Error("Set FIREBASE_DATABASE_URL or VITE_FIREBASE_DATABASE_URL.");

const source = fs.readFileSync(new URL("../src/questions.ts", import.meta.url), "utf8")
  .replace(/export interface Question \{[\s\S]*?\}\n\n/, "")
  .replace(/export const questions: Question\[\] =/, "const questions =");
const englishModule = await import(`data:text/javascript;base64,${Buffer.from(`${source}\nexport { questions };`).toString("base64")}`);
const englishQuestions = englishModule.questions;
if (englishQuestions.length !== 100) throw new Error(`Expected 100 English questions, found ${englishQuestions.length}.`);

const geographyQuestions = [
  ["ସମ୍ବଳର ଉପଲବ୍ଧି ଅନୁସାରେ କେଉଁ ତିନୋଟି ଅନ୍ୟ ଠାରୁ ଭିନ୍ନ?", ["ପ୍ରାଣୀ", "ଉଦ୍ଭିଦ", "ଅଣୁଜୀବ", "ଜଳ"], "D"],
  ["କେଉଁଟି ପ୍ରାକୃତିକ ସମ୍ବଳ?", ["ଯାନବାହନ", "ବନ୍ୟପ୍ରାଣୀ", "ପରିବହନ", "କଳକାରଖାନା"], "B"],
  ["କେଉଁଟି ସାଂସ୍କୃତିକ ସମ୍ବଳ ନୁହେଁ?", ["ଶିଳ୍ପ", "ଖଣିଜ ପଦାର୍ଥ", "ଶିକ୍ଷା ଓ ଅର୍ଥଲଗାଣ", "ମାନବ ସମ୍ବଳ"], "B"],
  ["ପ୍ରକୃତି ଅନୁସାରେ କେଉଁଟି ସମ୍ବଳର ଏକ ପ୍ରକାରଭେଦ ନୁହେଁ?", ["ଅସରନ୍ତି ସମ୍ବଳ", "ସାଂସ୍କୃତିକ ସମ୍ବଳ", "ପ୍ରାକୃତିକ ସମ୍ବଳ", "ମାନବ ସମ୍ବଳ"], "A"],
  ["ମନୁଷ୍ୟ ଏବଂ ତାର ପରିବେଶ ଓ ସାଂସ୍କୃତିକ ସଂଗଠନର ମିଳିତ ପ୍ରକ୍ରିୟାରେ କେଉଁଟି ସୃଷ୍ଟି ହୁଏ?", ["ପ୍ରାଦ୍ୟୋଗ", "ପ୍ରାକୃତିକ", "ସମ୍ବଳ", "ଅନୁଷ୍ଠାନ"], "C"],
  ["ମନୁଷ୍ୟ ନିଜର ଦକ୍ଷତା ଓ କାରିଗରୀ ଜ୍ଞାନକୌଶଳ ମାଧ୍ୟମରେ ପ୍ରାକୃତିକ ସମ୍ବଳକୁ ରୂପାନ୍ତରିତ କଲେ କେଉଁ ସମ୍ବଳ ସୃଷ୍ଟି ହୁଏ?", ["ସାଂସ୍କୃତିକ", "ମାନବୀୟ", "ନବୀକରଣଯୋଗ୍ୟ", "ବ୍ୟକ୍ତିଗତ"], "A"],
  ["ମନୁଷ୍ୟ ବ୍ୟବହାର କରୁଥିବା ସମସ୍ତ ସମ୍ବଳ କେଉଁଠାରୁ ଉପଲବ୍ଧ ହୋଇଥାଏ?", ["ସାଂସ୍କୃତିକ ପରିବେଶରୁ", "ପ୍ରାକୃତିକ ପରିବେଶରୁ", "ସମ୍ବଳ ଭଣ୍ଡାରରୁ", "ବାୟୁମଣ୍ଡଳରୁ"], "B"],
  ["ଯେଉଁ ସମ୍ବଳ ମନୁଷ୍ୟର ବାରମ୍ବାର ବ୍ୟବହାର ସତ୍ତ୍ୱେ ସରେ ନାହିଁ ତାକୁ କେଉଁ ସମ୍ବଳ କୁହନ୍ତି?", ["ଅକ୍ଷୟ", "କ୍ଷୟଶୀଳ", "ଜୈବ", "ଅଜୈବ"], "A"],
  ["ମନୁଷ୍ୟର ବ୍ୟବହାର ଦ୍ୱାରା ଶେଷ ହୋଇଯିବାର ଆଶଙ୍କା ଥିବା ସମ୍ବଳକୁ କ'ଣ କହନ୍ତି?", ["ସୀମିତ", "ଅସରନ୍ତି", "ସ୍ଥାନୀୟ", "ସର୍ବତ୍ର ସୁଲଭ"], "A"],
  ["କେଉଁଟି ଉଭୟ ପ୍ରାକୃତିକ ଓ ଅସରନ୍ତି ସମ୍ବଳ?", ["ପେଟ୍ରୋଲିୟମ", "କୋଇଲା", "ଉଦ୍ଭିଦ", "ବାୟୁ"], "D"],
  ["ନିମ୍ନୋକ୍ତ ମଧ୍ୟରୁ କେଉଁଟି ସମ୍ବଳର ଏକ ବିଶେଷତ୍ୱ ନୁହେଁ?", ["ଉପଯୋଗୀତା", "ଗ୍ରହଣଯୋଗୀତା", "ପରିବର୍ତ୍ତନଶୀଳତା", "ସୁଲଭତା"], "B"],
  ["ପୂରଣୀୟ ସମ୍ବଳ ଦୃଷ୍ଟିରେ କେଉଁଟି ଅନ୍ୟ ତିନୋଟିଠାରୁ ଭିନ୍ନ?", ["ସୌରଶକ୍ତି", "ଭୂ-ତାପଜ ଶକ୍ତି", "ଜୁଆର ଶକ୍ତି", "କୋଇଲା"], "D"],
  ["ପରିମାଣ ଅନୁସାରେ କେଉଁଟି ଅନ୍ୟ ତିନୋଟିଠାରୁ ଅଲଗା?", ["ଖଣିଜ ପଦାର୍ଥ", "ଖଣିଜ ତୈଳ", "ଭୂମି", "କୋଇଲା"], "C"],
  ["ଚକ୍ରୀୟ ପ୍ରକ୍ରିୟା ଦ୍ୱାରା କେଉଁଟି ଆଉ ଥରେ ନବୀକରଣ କରାଯାଇ ବ୍ୟବହୃତ ହୋଇ ନଥାଏ?", ["ଜଙ୍ଗଲଜାତ ପଦାର୍ଥ", "ପ୍ରାଣୀଜାତ ପଦାର୍ଥ", "କୃଷିଜାତ ପଦାର୍ଥ", "ପେଟ୍ରୋଲିୟମ"], "D"],
  ["ଯାନ୍ତ୍ରିକ ପଦ୍ଧତିରେ ପୁନଃଚକ୍ରୀୟ ପ୍ରକ୍ରିୟା ଦ୍ୱାରା ଆଉ ଥରେ ବ୍ୟବହାରଯୋଗ୍ୟ ସମ୍ବଳକୁ କ'ଣ କହନ୍ତି?", ["ଅବିରାମ", "ପୁନରୁଦ୍ଧାର ଯୋଗ୍ୟ", "ନବୀକରଣ ଯୋଗ୍ୟ", "ଅକ୍ଷୟ"], "A"],
  ["କେଉଁଟି ପୁନରୁଦ୍ଧାର ଯୋଗ୍ୟ ସମ୍ବଳ?", ["କୋଇଲା", "ଜଳ", "ପେଟ୍ରୋଲିୟମ", "ତମ୍ବା"], "D"],
  ["ବଣ୍ଟନ ଅନୁସାରେ କେଉଁ ସମ୍ବଳଟି ଅନ୍ୟ ତିନୋଟିଠାରୁ ଅଲଗା?", ["ଭୂମି", "ଜଳ", "ଖଣିଜ ପଦାର୍ଥ", "ବାୟୁ"], "C"],
  ["କେଉଁଟି ସର୍ବତ୍ର ସୁଲଭ ସମ୍ବଳ ନୁହେଁ?", ["ଭୂମି", "ଖଣିଜ ପଦାର୍ଥ", "ଜଳ", "ବାୟୁ"], "B"],
  ["ସମୁଦ୍ର ତଳେ ଥିବା ଖଣିଜ ପଦାର୍ଥ କେଉଁ ସମ୍ବଳ ଅନ୍ତର୍ଗତ?", ["ସ୍ଥାନୀୟ", "ସମ୍ବଳ ଭଣ୍ଡାର", "ଗଚ୍ଛିତ", "ଅବିରାମ"], "C"],
  ["ପ୍ରକୃତିର ଗନ୍ତାଘରେ ଅବ୍ୟବହୃତ ଅବସ୍ଥାରେ ଥିବା ସମ୍ବଳକୁ କ'ଣ କହନ୍ତି?", ["ସର୍ବତ୍ର ସୁଲଭ", "ପ୍ରଚ୍ଛନ୍ନ", "ଅକ୍ଷୟ", "ଅପୂରଣୀୟ"], "B"],
  ["ଗୁଜୁରାଟ ଓ ରାଜସ୍ଥାନରେ ମହଜୁଦ ଥିବା ପ୍ରଚୁର ସୌର ଶକ୍ତି ଓ ପବନ ଶକ୍ତି କେଉଁ ସମ୍ବଳ?", ["ଗଚ୍ଛିତ ସମ୍ବଳ", "ସମ୍ଭାବ୍ୟ ସମ୍ବଳ", "ପୁନରୁଦ୍ଧାର ଯୋଗ୍ୟ", "ସଂରକ୍ଷିତ ସମ୍ବଳ"], "A"],
  ["ବିକାଶ ସ୍ତର ଅନୁସାରେ କେଉଁଟି ସମ୍ବଳର ଏକ ପ୍ରକାରଭେଦ ନୁହେଁ?", ["ସଂରକ୍ଷିତ", "ସମ୍ବଳ ଭଣ୍ଡାର", "ଅକ୍ଷୟ", "ବିକଶିତ"], "C"],
  ["ପ୍ରବାହିତ ଜଳ ଯାହା ବିଦ୍ୟୁତ ଉତ୍ପାଦନ ପାଇଁ ବ୍ୟବହାର ହୋଇପାରୁ ନାହିଁ ତାହା କେଉଁ ସମ୍ବଳ ଅନ୍ତର୍ଗତ?", ["ବିକଶିତ", "ସଂରକ୍ଷିତ", "ଗଚ୍ଛିତ", "ଅକ୍ଷୟ"], "B"],
  ["ସନ୍ଧାନ ମିଳିଛି ମାତ୍ର ବ୍ୟବହାର ଉପଯୋଗୀ ହୋଇନାହିଁ କିନ୍ତୁ ଭବିଷ୍ୟତରେ ଉପଯୋଗୀ ହେବାର ସମ୍ଭାବନା ଅଛି । ଏହା କେଉଁ ସମ୍ବଳ ଅନ୍ତର୍ଗତ?", ["ସଂରକ୍ଷିତ", "ବିକଶିତ", "ଅବିରାମ", "ସ୍ଥାନୀୟ"], "A"],
  ["ନିମ୍ନୋକ୍ତ ମଧ୍ୟରୁ କେଉଁଟି ବିକଶିତ ସମ୍ବଳ?", ["ପୁଷ୍କରିଣୀ", "ଅରଣ୍ୟ", "ଭୂମି", "କୂପ"], "B"],
  ["ମାଲିକାନା ଅନୁସାରେ ସମ୍ବଳ କେତେ ପ୍ରକାର?", ["୨", "୩", "୪", "୬"], "C"],
  ["ଚିତ୍ତବିନୋଦନ କେଉଁ ସମ୍ବଳ ଅନ୍ତର୍ଗତ?", ["ଗୋଷ୍ଠୀଗତ", "ବ୍ୟକ୍ତିଗତ", "ଜାତୀୟ", "ଆନ୍ତର୍ଜାତୀୟ"], "A"],
  ["କେଉଁଟି ଉଭୟ ବ୍ୟକ୍ତିଗତ ଓ ଗୋଷ୍ଠୀଗତ ସମ୍ବଳ?", ["ଅରଣ୍ୟ", "ରାସ୍ତାଘାଟ", "କୂପ", "କେନାଲ"], "C"],
  ["ସମୂହ ମାଲିକାନାରେ ଥିବା ସ୍ଥାବର ଓ ଅସ୍ଥାବର ସମ୍ପତ୍ତି କେଉଁ ସମ୍ବଳ ଅନ୍ତର୍ଭୁକ୍ତ?", ["ଗୋଷ୍ଠୀଗତ", "ପ୍ରାକୃତିକ", "ଜୈବ", "ସର୍ବତ୍ର ସୁଲଭ"], "A"],
  ["ଏକ ନଟିକାଲ ମାଇଲ କେତେ କିଲୋମିଟର?", ["୨", "୧.୮୫", "୨.୫୪", "୨.୨"], "B"],
  ["ଉପକୂଳଠାରୁ ସମୁଦ୍ର ଆଡ଼କୁ ପ୍ରାୟ କେତେ କିଲୋମିଟର ଦୂରତାରେ ଥିବା ଜଳଭାଗ ଜାତୀୟ ସମ୍ବଳ ଅନ୍ତର୍ଭୁକ୍ତ?", ["୧୦.୮", "୧୨", "୨୦.୩", "୨୨.୨"], "D"],
];

if (geographyQuestions.length !== 31) throw new Error(`Expected 31 Geography questions, found ${geographyQuestions.length}.`);

const createdAt = new Date().toISOString();
const tests = {
  [englishTestId]: { id: englishTestId, title: "English Mock Test", subject: "English", topic: "At the High School", class_name: "Class 10th", session: "2026-2027", duration_minutes: 90, prepared_by: "Jitan Online Test", is_active: true, created_at: createdAt },
  [geographyTestId]: { id: geographyTestId, title: "Geography Mock Test", subject: "Geography", topic: "Resources", class_name: "Class 10th", session: "2026-2027", duration_minutes: 45, prepared_by: "Jitan Online Test", is_active: true, created_at: createdAt },
};
const questions = {};

for (const question of englishQuestions) {
  const id = `english-${String(question.id).padStart(3, "0")}`;
  questions[id] = { id, test_id: englishTestId, question_text: question.text, option_a: question.options[0], option_b: question.options[1], option_c: question.options[2], option_d: question.options[3], correct_answer: ["A", "B", "C", "D"][question.correctAnswer], display_order: question.id, created_at: createdAt };
}
for (const [index, [text, options, correctAnswer]] of geographyQuestions.entries()) {
  const number = index + 1;
  const id = `geo_resource_${String(number).padStart(3, "0")}`;
  questions[id] = { id, test_id: geographyTestId, question_text: text, option_a: options[0], option_b: options[1], option_c: options[2], option_d: options[3], correct_answer: correctAnswer, display_order: number, created_at: createdAt };
}

const auth = databaseSecret ? `?auth=${encodeURIComponent(databaseSecret)}` : "";
async function write(path, value) {
  const response = await fetch(`${databaseUrl}/${path}.json${auth}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
  if (!response.ok) throw new Error(`Could not write ${path}: ${response.status} ${await response.text()}`);
}

await write("tests", tests);
await write("questions", questions);
console.log(`Restored ${Object.keys(tests).length} tests and ${Object.keys(questions).length} questions.`);
