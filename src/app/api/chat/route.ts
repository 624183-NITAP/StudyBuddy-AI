import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;
    let context = body.context || "";
    
    // Ensure we don't exceed model limits
    context = context.substring(0, 4000);

    const prompt = `You are StudyBuddy AI, an intelligent and friendly tutor helping a student study for exams.
You ALREADY have access to the user's uploaded document. The contents of their document are provided to you below in the "Context from Notes" section.

CRITICAL RULES:
- Never say you don't have access to external files, because the text is literally provided to you below.
- Answer the user's question based primarily on this context. 
- If the user asks to change the context or upload a new file, politely tell them to upload the new document on the Home page first.

Context from Notes:
${context || "No document uploaded yet."}

Student Question:
${message}
`;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "Sorry, I couldn't connect to the local Ollama instance. Make sure Ollama is running and the llama3.2 model is installed!" },
      { status: 500 }
    );
  }
}
