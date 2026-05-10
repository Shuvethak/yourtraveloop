import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Traveloop" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  return <AuthShell title="Welcome back" subtitle="Continue planning your next escape">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} required />
      <Field label="Password" type="password" value={password} onChange={setPassword} required />
      <button disabled={loading} className="w-full rounded-xl gradient-primary text-white font-medium py-2.5 hover:opacity-90 disabled:opacity-50 transition glow-primary">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
    <p className="mt-5 text-sm text-muted-foreground text-center">
      New here? <Link to="/signup" className="text-accent hover:underline">Create an account</Link>
    </p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen relative grid-pattern flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-elegant"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-lg tracking-tight">Traveloop</span>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-center">{title}</h1>
        <p className="text-sm text-muted-foreground text-center mt-1.5 mb-7">{subtitle}</p>
        {children}
      </motion.div>
    </main>
  );
}

export function Field({
  label, type = "text", value, onChange, required,
}: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-transparent transition"
      />
    </label>
  );
}
