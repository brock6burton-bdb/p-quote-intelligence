export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

async function verifyPayment(sessionId: string, demo: boolean) {
  if (demo && process.env.PRISM_DEMO_MODE === "true") return true;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId) return false;

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${key}` }
  });

  if (!response.ok) return false;
  const session = await response.json();
  return session.payment_status === "paid";
}

async function uploadToOpenAI(file: File, apiKey: string) {
  const form = new FormData();
  form.append("purpose", "user_data");
  form.append("file", file, file.name);

  const response = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });

  const data = await response.json();
  if (!response.ok || !data.id) {
    console.error("OpenAI file upload error:", data);
    throw new Error(`Could not process ${file.name}.`);
  }
  return data.id as string;
}

function extractJson(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("The AI response was not valid JSON.");
  return JSON.parse(cleaned.slice(first, last + 1));
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "OpenAI is not configured yet." }, { status: 500 });
    }

    const form = await request.formData();
    const files = form.getAll("files").filter((item): item is File => item instanceof File);
    const projectType = String(form.get("projectType") || "Home project");
    const notes = String(form.get("notes") || "");
    const sessionId = String(form.get("sessionId") || "");
    const demo = String(form.get("demo") || "") === "1";

    if (!(await verifyPayment(sessionId, demo))) {
      return Response.json({ error: "Payment could not be verified." }, { status: 402 });
    }

    if (!files.length || files.length > MAX_FILES) {
      return Response.json({ error: "Upload between one and three quotes." }, { status: 400 });
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return Response.json({ error: `${file.name} is not a supported file type.` }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return Response.json({ error: `${file.name} is larger than 10 MB.` }, { status: 400 });
      }
    }

    const fileIds = await Promise.all(files.map(file => uploadToOpenAI(file, apiKey)));

    const content: Array<Record<string, string>> = fileIds.map(file_id => ({
      type: "input_file",
      file_id
    }));

    content.push({
      type: "input_text",
      text: `You are Prism, the world's best homeowner advocate.

Your mission is NOT to summarize contractor proposals.

Your mission is to help homeowners confidently decide whether they should hire a contractor.

Think like:

• A veteran general contractor with 30 years of experience.
• A professional construction estimator.
• A home inspector.
• A consumer protection advocate.
• A homeowner who has hired dozens of contractors.

Never simply repeat what is written in the proposal.

Interpret it.

Explain why information matters.

Explain how omissions create risk.

Help the homeowner avoid bad decisions.

If information is missing, clearly state that it is missing.

Never invent facts.

Never exaggerate.

Whenever possible compare the proposal to normal industry practices.

Explain whether something is typical, above average, below average, or impossible to determine.

Always prioritize homeowner protection over simply describing the quote.

Project:

${projectType}

Homeowner Notes:

${notes || "None provided"}

Return ONLY valid JSON matching exactly this structure.

{
  "projectType":"string",
  "summary":"Executive summary focused on the hiring decision rather than summarizing the proposal.",
  "recommendedContractor":"string",
  "recommendationReason":"Explain exactly WHY this contractor is recommended and what should still be confirmed before signing.",
  "confidenceScore":0,
  "quotes":[
    {
      "name":"Contractor",
      "price":"string",
      "score":0,
      "strengths":[
        "Explain WHY each strength benefits the homeowner."
      ],
      "concerns":[
        "Explain WHY each concern matters and what could happen if ignored."
      ],
      "details":{
        "scope":"Assess completeness, not simply scope.",
        "warranty":"Explain whether warranty appears strong for the industry.",
        "permits":"Explain why permit responsibility matters.",
        "timeline":"Discuss whether timeline is adequate.",
        "paymentTerms":"Assess fairness and clarity.",
        "exclusions":"Explain how exclusions could create additional costs."
      }
    }
  ],
  "riskFlags":[
    {
      "priority":"High|Medium|Low",
      "title":"string",
      "explanation":"Explain the homeowner impact.",
      "contractor":"string"
    }
  ],
  "questionsToAsk":[
    "Generate personalized questions based ONLY on missing or unclear information."
  ],
  "negotiationIdeas":[
    "Suggest realistic improvements supported by this proposal."
  ],
  "suggestedMessage":"Write a professional message the homeowner could actually send.",
  "disclaimer":"Prism provides decision support, not legal, engineering, or contractor licensing advice."
}

The recommendation should answer one question:

Would an experienced homeowner feel comfortable hiring this contractor?

confidenceScore and quote scores must be integers between 0 and 100.`
    });

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [{ role: "user", content }]
      })
    });

    const aiData = await aiResponse.json();
    if (!aiResponse.ok) {
      console.error("OpenAI response error:", aiData);
      return Response.json({ error: "Prism could not analyze the quotes." }, { status: 500 });
    }

    const outputText =
      aiData.output_text ||
      aiData.output?.flatMap((item: any) => item.content || [])
        .find((item: any) => item.type === "output_text")?.text;

    if (!outputText) {
      return Response.json({ error: "Prism returned an empty analysis." }, { status: 500 });
    }

    const report = extractJson(outputText);
    return Response.json({ report });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Analysis failed." },
      { status: 500 }
    );
  }
}
