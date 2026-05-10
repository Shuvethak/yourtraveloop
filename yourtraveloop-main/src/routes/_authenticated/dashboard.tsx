import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, MapPin, Calendar, Wallet, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { inr } from "@/lib/format";
import { format, differenceInDays } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Traveloop" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: trips = [], isLoading } = useQuery({
    queryKey: ["trips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalBudget = trips.reduce((s, t) => s + Number(t.budget_inr || 0), 0);
  const upcoming = trips.filter((t) => t.start_date && new Date(t.start_date) >= new Date()).length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-accent flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Your travel workspace</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
            Namaste, <span className="gradient-text">{user?.user_metadata?.full_name?.split(" ")[0] ?? "traveller"}</span>
          </h1>
        </div>
        <Link to="/trips/new" className="inline-flex items-center gap-2 rounded-full gradient-primary text-white px-5 py-2.5 font-medium glow-primary hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> New trip
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat icon={<MapPin className="w-4 h-4" />} label="Total trips" value={String(trips.length)} />
        <Stat icon={<Calendar className="w-4 h-4" />} label="Upcoming" value={String(upcoming)} />
        <Stat icon={<Wallet className="w-4 h-4" />} label="Total budget" value={inr(totalBudget)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Your trips</h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Synced live</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => <div key={i} className="h-48 rounded-2xl glass animate-pulse" />)}
          </div>
        ) : trips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to="/trips/$tripId" params={{ tripId: t.id }}
                  className="group block glass-strong rounded-2xl p-5 hover:-translate-y-1 hover:border-accent/40 transition-all duration-300 shadow-soft"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{t.cover_emoji ?? "🗺️"}</div>
                    <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {t.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight group-hover:text-accent transition-colors">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.destination}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {t.start_date ? format(new Date(t.start_date), "MMM d") : "—"}
                      {t.end_date ? ` → ${format(new Date(t.end_date), "MMM d")}` : ""}
                    </span>
                    <span className="font-medium text-foreground">{inr(Number(t.budget_inr || 0))}</span>
                  </div>
                  {t.start_date && t.end_date && (
                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full"
                        style={{ width: `${Math.min(100, ((differenceInDays(new Date(t.end_date), new Date(t.start_date)) + 1) / 14) * 100)}%` }} />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-strong rounded-3xl p-10 text-center">
      <div className="text-5xl mb-3">🧭</div>
      <h3 className="text-lg font-semibold">No trips yet</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
        Plan your first journey across India — from Goan beaches to Himalayan peaks.
      </p>
      <Link to="/trips/new" className="mt-5 inline-flex items-center gap-2 rounded-full gradient-primary text-white px-5 py-2.5 font-medium glow-primary">
        <Plus className="w-4 h-4" /> Create your first trip
      </Link>
    </div>
  );
}
