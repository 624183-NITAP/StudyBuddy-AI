"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, ChevronRight, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [recentFiles, setRecentFiles] = useState<{ name: string; type: string; date: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("studybuddy_files");
    if (saved) {
      setRecentFiles(JSON.parse(saved));
    } else {
      setRecentFiles([
        { name: "Data_Structures_Unit_1.pdf", type: "PDF", date: "Today" },
        { name: "Operating_Systems_Notes.docx", type: "DOCX", date: "Yesterday" }
      ]);
    }
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const file = e.target.files[0];
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (res.ok) {
          // Update recent files list
          const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
          const newFiles = [{ name: file.name, type: ext, date: "Just now" }, ...recentFiles];
          setRecentFiles(newFiles);
          localStorage.setItem("studybuddy_files", JSON.stringify(newFiles));
          alert("Notes indexed successfully! You can now chat with them.");
        } else {
          alert("Failed to process document.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred during upload.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-slate-400">Ready to crush your semester exams?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[200px] border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500 transition-colors">
            <Upload className="w-10 h-10 text-slate-400" />
            <div>
              <p className="text-lg font-medium text-slate-200">Upload Study Materials</p>
              <p className="text-sm text-slate-500 mt-1">PDF, DOCX, TXT up to 50MB</p>
            </div>
            <label className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors font-medium">
              {isUploading ? "Processing..." : "Select Files"}
              <input type="file" className="hidden" accept=".pdf,.txt,.docx" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 flex flex-col">
          <Link href="/chat" className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500 transition-colors">
            <BrainCircuit className="w-8 h-8 text-cyan-400 mb-4" />
            <div>
              <h3 className="font-semibold text-lg">AI Chat</h3>
              <p className="text-sm text-slate-400 flex items-center mt-1">Ask questions <ChevronRight className="w-4 h-4 ml-1" /></p>
            </div>
          </Link>
          <Link href="/questions" className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500 transition-colors">
            <FileText className="w-8 h-8 text-emerald-400 mb-4" />
            <div>
              <h3 className="font-semibold text-lg">Generate Questions</h3>
              <p className="text-sm text-slate-400 flex items-center mt-1">Practice exams <ChevronRight className="w-4 h-4 ml-1" /></p>
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Materials</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Document Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles.map((file, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors text-slate-200">
                  <td className="px-6 py-4 flex items-center">
                    <FileText className={`w-5 h-5 mr-3 ${file.type === "PDF" ? "text-red-400" : file.type === "DOCX" ? "text-blue-400" : "text-emerald-400"}`} /> 
                    {file.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{file.type}</td>
                  <td className="px-6 py-4 text-slate-400">{file.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
