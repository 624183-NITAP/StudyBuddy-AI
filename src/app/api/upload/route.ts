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

    // Save context to a local file for the demo
    const contextPath = path.join(os.tmpdir(), "context.txt");
    await fs.writeFile(contextPath, text);

    return NextResponse.json({ success: true, message: "File processed and indexed" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}
