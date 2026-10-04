"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  Globe,
  Database,
  Check,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { SessionUser } from "@/lib/auth";

export function SettingsClient({ initialUser }: { initialUser: SessionUser }) {
  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setMessage(null);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setMessage({ text: "Profile details updated successfully!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }

    try {
      setSavingSecurity(true);
      setMessage(null);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");

      setMessage({ text: "Password changed successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSavingSecurity(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          <span>System Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure administrator credentials, custom domains, and platform preferences.
        </p>
      </div>

      {/* Global Feedback Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. Admin Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <User className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Administrator Profile</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow"
          >
            {savingProfile ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>

      {/* 2. Security & Password Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <KeyRound className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Security & Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Current Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">New Password</label>
            <input
              type="password"
              required
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingSecurity}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold flex items-center gap-1.5 border border-slate-700 shadow"
          >
            {savingSecurity ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>

      {/* 3. Custom Domain Configuration Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Globe className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Custom Domain Mapping</h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          SiteForge supports custom host routing. To point your custom domain (e.g.{" "}
          <code className="text-blue-400 font-mono">www.yourbrand.com</code>), configure
          the following DNS records with your DNS registrar:
        </p>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
          <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-400 font-semibold">
            <span>TYPE</span>
            <span>NAME / HOST</span>
            <span>TARGET / VALUE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-400">CNAME</span>
            <span>www</span>
            <span className="text-emerald-400">cname.siteforge.io</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-400">A</span>
            <span>@</span>
            <span className="text-emerald-400">76.76.21.21</span>
          </div>
        </div>
      </div>

      {/* 4. Platform Engine Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Database & Runtime Stack</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">Framework</span>
            <div className="font-bold text-white mt-0.5">Next.js 15 (App Router)</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">ORM</span>
            <div className="font-bold text-white mt-0.5">Prisma Client</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">Session Guard</span>
            <div className="font-bold text-white mt-0.5">JWT / Jose (HTTP-Only)</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">Component Tree</span>
            <div className="font-bold text-white mt-0.5">Structured JSON</div>
          </div>
        </div>
      </div>
    </div>
  );
}
