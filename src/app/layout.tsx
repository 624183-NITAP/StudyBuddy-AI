import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen, MessageSquare, BrainCircuit, Library, Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyBuddy AI",
  description: "Your AI-powered study assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased h-screen flex overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex print:hidden">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <BrainCircuit className="w-6 h-6 text-indigo-500 mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              StudyBuddy AI
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/" className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <Library className="w-5 h-5 mr-3" />
              Notes & Dashboard
            </Link>
            <Link href="/chat" className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <MessageSquare className="w-5 h-5 mr-3" />
              AI Chat
            </Link>
            <Link href="/questions" className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <BookOpen className="w-5 h-5 mr-3" />
              Questions & Flashcards
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden print:overflow-visible">
          <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center px-6 md:hidden print:hidden">
            <Menu className="w-6 h-6 text-slate-400 mr-4" />
            <span className="text-xl font-bold text-white">StudyBuddy</span>
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 print:overflow-visible">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
