import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = body.type;
    let context = body.context || "";
    
    // Ensure we don't exceed model limits
    context = context.substring(0, 4000);

    const prompt = `You are an expert tutor creating an exam based on the provided notes. Generate 4 exam questions of type: ${type}.
Format your output strictly as a JSON array where each object has "mark" (integer), "q" (question string), and "a" (answer string).
CRITICAL RULES:
- If the question is worth 5 marks or more, the answer MUST be highly detailed (at least 3-4 sentences or bullet points) explaining the concepts thoroughly.
- Do NOT include any markdown formatting like \`\`\`json, just return the raw JSON array.

Context:
${context || "No context provided. Generate some generic questions about computer science."}`;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: prompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error`);
    }

    // Stream the raw Ollama response back to the client
    return new Response(response.body, {
      headers: { "Content-Type": "application/x-ndjson" }
    });

  } catch (error) {
    console.error("Questions error:", error);
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 });
  }
}
