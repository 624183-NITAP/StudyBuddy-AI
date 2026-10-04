# StudyBuddy AI

*This project was built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built
I built **StudyBuddy AI**, a local, privacy-first AI study companion designed to help my friend prepare for their upcoming university exams. 

My friend often struggles to find good practice questions or consolidate their lecture notes into actionable study material. They spend hours just trying to come up with potential exam questions instead of actually studying the concepts. StudyBuddy AI solves this by allowing them to upload their course notes and automatically generating targeted exam questions (short 2-mark questions, detailed 5-mark questions, and even Viva/Interview style questions). It also includes an AI chat feature for instant tutoring on difficult topics, and a flashcard generator to help memorize key definitions.

## How I Built It
The project is a modern web application built with:
* **Frontend:** Next.js (React) and Tailwind CSS for a sleek, responsive, and dynamic UI.
* **Backend:** Next.js API Routes handling server-side logic and streaming.
* **AI Engine:** **Ollama** running the **Llama 3.2** open-weight model completely locally.

Instead of relying on closed APIs, the application connects directly to a local Ollama instance (`http://127.0.0.1:11434/api/generate`). 
A key technical challenge I solved was the perceived latency when generating detailed 5-mark questions. To fix this, I implemented an NDJSON streaming parser that reads chunks from Ollama in real-time, extracts completed JSON objects using regex, and streams the UI components back to the user progressively so they don't have to wait for the entire exam to be generated before seeing the first question.

## Why Does Open Innovation Matter?
Open innovation was absolutely critical for this project. As a student, my friend cannot afford expensive API subscriptions for AI models. Furthermore, studying often involves uploading lecture slides or personal notes that shouldn't necessarily be shipped off to a third-party server. 

By leveraging **Llama 3.2** via **Ollama**, StudyBuddy AI runs entirely on local hardware. It makes personalized, high-quality AI tutoring completely free, fast, and 100% private. Open-weight models empower developers to build these hyper-personalized, zero-cost tools that directly improve people's everyday lives—something that simply wouldn't be sustainable on a tight student budget using closed APIs.

## My Agent Session
{% agent_session 28b26a99-6318-46f9-9ff9-5c1efc7b052a %}

## Prize Categories
* **Local AI Hero**
* **Open Source Innovator**

## Getting Started

First, make sure you have [Ollama](https://ollama.com/) installed and running locally with the `llama3.2` model.
```bash
ollama run llama3.2
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
