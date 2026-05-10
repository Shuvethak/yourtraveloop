import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Traveloop" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — let's plan!");
    navigate({ to: "/dashboard" });
  };

  return <AuthShell title="Start planning" subtitle="Free forever — no credit card needed">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name" value={name} onChange={setName} required />
      <Field label="Email" type="email" value={email} onChange={setEmail} required />
      <Field label="Password" type="password" value={password} onChange={setPassword} required />
      <button disabled={loading} className="w-full rounded-xl gradient-primary text-white font-medium py-2.5 hover:opacity-90 disabled:opacity-50 transition glow-primary">
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
    <p className="mt-5 text-sm text-muted-foreground text-center">
      Already a member? <Link to="/login" className="text-accent hover:underline">Sign in</Link>
    </p>
  </AuthShell>;
}
