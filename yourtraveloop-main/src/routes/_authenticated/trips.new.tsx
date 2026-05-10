import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { INDIA_DESTINATIONS, TRIP_VIBES, STARTER_STOPS } from "@/lib/india-data";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/trips/new")({
  head: () => ({ meta: [{ title: "Plan a new trip — Traveloop" }] }),
  component: NewTrip,
});

function NewTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [destId, setDestId] = useState<string>("");
  const [vibe, setVibe] = useState<string>("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(25000);
  const [saving, setSaving] = useState(false);

  const dest = INDIA_DESTINATIONS.find((d) => d.id === destId);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const create = async () => {
    if (!dest || !user) return;
    setSaving(true);
    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        title: `${dest.name} ${vibe || "escape"}`.trim(),
        destination: `${dest.name}, ${dest.region}`,
        cover_emoji: dest.emoji,
        vibe,
        start_date: start || null,
        end_date: end || null,
        budget_inr: budget,
        travelers,
      })
      .select()
      .single();
    if (error || !trip) { setSaving(false); return toast.error(error?.message ?? "Failed"); }

    const seeds = STARTER_STOPS[dest.id];
    if (seeds?.length) {
      await supabase.from("trip_stops").insert(
        seeds.map((s, i) => ({
          trip_id: trip.id, day: s.day, position: i, title: s.title,
          location: s.location, time: s.time, category: s.category, cost_inr: s.cost,
        }))
      );
    }
    toast.success("Trip created!");
    navigate({ to: "/trips/$tripId", params: { tripId: trip.id } });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Stepper step={step} />
      <div className="glass-strong rounded-3xl p-6 sm:p-8 mt-6 shadow-elegant min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <Section title="Where to?" subtitle="Pick a destination across India">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INDIA_DESTINATIONS.map((d) => (
                    <button key={d.id} onClick={() => setDestId(d.id)}
                      className={`text-left glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 ${destId === d.id ? "ring-2 ring-accent glow-primary" : ""}`}
                    >
                      <div className="text-3xl">{d.emoji}</div>
                      <div className="mt-2 font-medium text-sm">{d.name}</div>
                      <div className="text-[11px] text-muted-foreground">{d.tagline}</div>
                      <div className="text-[10px] text-accent mt-1">from {inr(d.fromInr)}</div>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {step === 1 && (
              <Section title="What's the vibe?" subtitle="Helps the AI tailor your itinerary">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TRIP_VIBES.map((v) => (
                    <button key={v.id} onClick={() => setVibe(v.label)}
                      className={`glass rounded-2xl p-4 text-center transition hover:-translate-y-0.5 ${vibe === v.label ? "ring-2 ring-accent glow-primary" : ""}`}
                    >
                      <div className="text-2xl">{v.emoji}</div>
                      <div className="text-sm mt-1">{v.label}</div>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {step === 2 && (
              <Section title="When?" subtitle="Pick your travel window">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateField label="Start date" value={start} onChange={setStart} />
                  <DateField label="End date" value={end} onChange={setEnd} />
                </div>
                <div className="mt-6">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Travellers</label>
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button key={n} onClick={() => setTravelers(n)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition ${travelers === n ? "gradient-primary text-white" : "glass hover:bg-white/10"}`}
                      >{n}</button>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {step === 3 && (
              <Section title="What's your budget?" subtitle="In Indian Rupees, total trip">
                <div className="text-center my-6">
                  <div className="text-4xl font-semibold tracking-tight gradient-text">{inr(budget)}</div>
                  <div className="text-xs text-muted-foreground mt-1">≈ {inr(Math.round(budget / Math.max(1, travelers)))} per traveller</div>
                </div>
                <input
                  type="range" min={5000} max={500000} step={1000}
                  value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>₹5K</span><span>₹5L</span>
                </div>
                {dest && (
                  <div className="mt-6 glass rounded-2xl p-4 text-sm">
                    <div className="font-medium">{dest.emoji} {dest.name} • {vibe || "Custom"}</div>
                    <div className="text-xs text-muted-foreground mt-1">{travelers} traveller{travelers > 1 ? "s" : ""} · {start || "—"} → {end || "—"}</div>
                  </div>
                )}
              </Section>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <button onClick={back} disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full glass disabled:opacity-30 hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={next} disabled={(step === 0 && !destId) || (step === 1 && !vibe)}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2 rounded-full gradient-primary text-white disabled:opacity-40 glow-primary"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={create} disabled={saving}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2 rounded-full gradient-primary text-white disabled:opacity-50 glow-primary"
            >
              {saving ? "Creating…" : <><Check className="w-4 h-4" /> Create trip</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Destination", "Vibe", "Dates", "Budget"];
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex-1">
          <div className={`h-1 rounded-full transition-all ${i <= step ? "gradient-primary" : "bg-white/10"}`} />
          <div className={`text-[11px] mt-1.5 uppercase tracking-wider ${i === step ? "text-accent" : "text-muted-foreground"}`}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 transition [color-scheme:dark]"
      />
    </label>
  );
}
