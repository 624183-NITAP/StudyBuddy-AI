"use client";

import { useState, useEffect } from "react";
import { FileQuestion, CheckCircle2, Loader2, Download } from "lucide-react";

export default function QuestionsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<{ mark: number; q: string; a: string }[] | null>(null);
  const [selectedType, setSelectedType] = useState("all");
  const [availableDocs, setAvailableDocs] = useState<{name: string}[]>([
    {name: "Data_Structures_Unit_1.pdf"},
    {name: "Operating_Systems_Notes.docx"}
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("studybuddy_files");
    if (saved) {
      setAvailableDocs(JSON.parse(saved));
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setQuestions(null);
    try {
      const context = localStorage.getItem("studybuddy_context") || "";
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, context: context }),
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          
          // Ollama sends JSON objects separated by newlines
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                fullText += parsed.response;
              }
            } catch(e) {
              // ignore invalid JSON chunks
            }
          }
          
          // Use regex to find complete question objects in the stream so far
          const regex = /{[^{}]*"mark"\s*:[^{}]*"q"\s*:[^{}]*"a"\s*:[^{}]*}/g;
          const matches = fullText.match(regex);
          if (matches && matches.length > 0) {
            const parsedQuestions = matches.map((m: string) => {
              try { return JSON.parse(m); } catch (e) { return null; }
            }).filter(Boolean);
            
            if (parsedQuestions.length > 0) {
              setQuestions(parsedQuestions as any);
            }
          }
        }
      } else {
        alert("Failed to generate questions. Is Ollama running?");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating questions.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Exam Question Generator</h1>
        <p className="text-slate-400">Generate targeted questions based on your latest uploaded notes.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-slate-300">Question Type</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Mixed (2, 5, 10 marks)</option>
              <option value="2mark">2 Marks (Short)</option>
              <option value="5mark">5 Marks (Medium)</option>
              <option value="viva">Viva / Interview</option>
            </select>
          </div>
          
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-slate-300">Target Document</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              {availableDocs.map((doc, idx) => (
                <option key={idx} value={doc.name}>{doc.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white rounded-lg transition-colors font-medium flex items-center h-[42px]"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><FileQuestion className="w-4 h-4 mr-2" /> Generate Questions</>
            )}
          </button>
        </div>
      </div>

      {questions && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
              Generated Questions
            </h2>
            <button 
              onClick={() => window.print()}
              className="print:hidden flex items-center text-sm text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
            >
              <Download className="w-4 h-4 mr-2" /> Export to PDF
            </button>
          </div>

          <div className="grid gap-4 print:block print:space-y-6">
            {questions.map((item, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors group print:border-slate-300 print:bg-white print:text-black">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-medium text-slate-200 print:text-black">Q{i + 1}. {item.q}</h3>
                  <span className="shrink-0 px-2.5 py-1 bg-slate-800 text-indigo-400 text-xs font-semibold rounded-md border border-slate-700 print:border-slate-300 print:text-black print:bg-slate-100">
                    {item.mark} Marks
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/50 text-sm text-slate-400 hidden group-hover:block transition-all print:block print:bg-white print:border-none print:text-black">
                  <strong className="text-slate-300 block mb-1 print:text-black">Suggested Answer:</strong>
                  {item.a}
                </div>
                <p className="text-xs text-slate-500 mt-3 group-hover:hidden flex items-center print:hidden">
                  Hover to reveal suggested answer
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
