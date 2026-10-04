import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white font-sans text-center">
      <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-sm mt-2">
        The requested page or published website could not be found or has not been published yet.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
}
