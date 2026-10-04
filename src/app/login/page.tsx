import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginClient } from "./LoginClient";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LoginClient />
    </Suspense>
  );
}
