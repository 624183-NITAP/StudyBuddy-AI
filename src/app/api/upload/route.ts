import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs/promises";
import path from "path";import os from "os";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    let text = "";

    if (file.name.toLowerCase().endsWith(".pdf")) {
      const loader = new PDFLoader(file, { parsedItemSeparator: " " });
      const docs = await loader.load();
      text = docs.map((doc) => doc.pageContent).join("\n");
    } else {
      // Fallback for txt
      const buffer = Buffer.from(await file.arrayBuffer());
      text = buffer.toString("utf-8");
    }

    // Return the text instead of saving it to the server (Stateless for Vercel)
    return NextResponse.json({ success: true, text: text, message: "File processed and indexed" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}
