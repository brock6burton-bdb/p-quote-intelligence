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
      text: `You are Prism, an independent homeowner decision-support analyst.

Analyze the attached contractor proposals for this project: ${projectType}.
Homeowner notes: ${notes || "None provided"}.

Do not invent facts. Use "Not stated" whenever a quote does not provide a detail. Do not give legal, engineering, code-compliance, or contractor-licensing conclusions. Focus on quote clarity, scope, price, exclusions, warranties, risks, and questions.

Return ONLY valid JSON matching exactly this shape:
{
  "projectType": "string",
  "summary": "2-4 sentence plain-English summary",
  "recommendedContractor": "string",
  "recommendationReason": "string",
  "confidenceScore": 0,
  "quotes": [
    {
      "name": "Contractor A",
      "price": "string",
      "score": 0,
      "strengths": ["string"],
      "concerns": ["string"],
      "details": {
        "scope": "string",
        "warranty": "string",
        "permits": "string",
        "timeline": "string",
        "paymentTerms": "string",
        "exclusions": "string"
      }
    }
  ],
  "riskFlags": [
    { "priority": "High|Medium|Low", "title": "string", "explanation": "string", "contractor": "string" }
  ],
  "questionsToAsk": ["string"],
  "negotiationIdeas": ["string"],
  "suggestedMessage": "string",
  "disclaimer": "Prism provides decision support, not legal, engineering, or contractor licensing advice."
}

Score proposals based on completeness and homeowner protection, not merely lowest price. confidenceScore and quote scores must be integers from 0 to 100.`
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
