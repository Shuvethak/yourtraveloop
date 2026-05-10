import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft, MapPin, Calendar, Wallet, Users, Plus, GripVertical, Trash2,
  Clock, Sparkles, Utensils, Mountain, Camera, ShoppingBag, Bus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/trips/$tripId")({
  head: () => ({ meta: [{ title: "Trip — Traveloop" }] }),
  component: TripDetail,
});

type Stop = {
  id: string; trip_id: string; day: number; position: number;
  title: string; location: string | null; time: string | null;
  category: string | null; cost_inr: number; notes: string | null;
};

const CAT_ICONS: Record<string, React.ReactNode> = {
  food: <Utensils className="w-3.5 h-3.5" />,
  adventure: <Mountain className="w-3.5 h-3.5" />,
  sightseeing: <Camera className="w-3.5 h-3.5" />,
  shopping: <ShoppingBag className="w-3.5 h-3.5" />,
  transit: <Bus className="w-3.5 h-3.5" />,
  culture: <Sparkles className="w-3.5 h-3.5" />,
};

function TripDetail() {
  const { tripId } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: trip } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const { data, error } = await supabase.from("trips").select("*").eq("id", tripId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: stops = [] } = useQuery({
    queryKey: ["stops", tripId],
    queryFn: async () => {
      const { data, error } = await supabase.from("trip_stops").select("*").eq("trip_id", tripId)
        .order("day").order("position");
      if (error) throw error;
      return data as Stop[];
    },
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [activeDay, setActiveDay] = useState(1);

  const days = Array.from(new Set([1, ...stops.map((s) => s.day)])).sort((a, b) => a - b);
  const dayStops = stops.filter((s) => s.day === activeDay);
  const totalSpent = stops.reduce((s, x) => s + Number(x.cost_inr || 0), 0);
  const remaining = Number(trip?.budget_inr || 0) - totalSpent;

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = dayStops.findIndex((s) => s.id === active.id);
    const newIdx = dayStops.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(dayStops, oldIdx, newIdx);

    qc.setQueryData<Stop[]>(["stops", tripId], (prev = []) => {
      const others = prev.filter((s) => s.day !== activeDay);
      return [...others, ...reordered.map((s, i) => ({ ...s, position: i }))];
    });

    await Promise.all(
      reordered.map((s, i) =>
        supabase.from("trip_stops").update({ position: i }).eq("id", s.id)
      )
    );
  };

  const addStop = async () => {
    const { data, error } = await supabase.from("trip_stops").insert({
      trip_id: tripId, day: activeDay, position: dayStops.length,
      title: "New stop", location: "", time: "10:00", category: "sightseeing", cost_inr: 0,
    }).select().single();
    if (error) return toast.error(error.message);
    qc.setQueryData<Stop[]>(["stops", tripId], (prev = []) => [...prev, data as Stop]);
  };

  const updateStop = async (id: string, patch: Partial<Stop>) => {
    qc.setQueryData<Stop[]>(["stops", tripId], (prev = []) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
    await supabase.from("trip_stops").update(patch).eq("id", id);
  };

  const removeStop = async (id: string) => {
    qc.setQueryData<Stop[]>(["stops", tripId], (prev = []) => prev.filter((s) => s.id !== id));
    await supabase.from("trip_stops").delete().eq("id", id);
  };

  const addDay = () => setActiveDay(Math.max(...days, 0) + 1);

  const deleteTrip = async () => {
    if (!confirm("Delete this trip?")) return;
    await supabase.from("trips").delete().eq("id", tripId);
    toast.success("Trip deleted");
    navigate({ to: "/dashboard" });
  };

  if (!trip) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 shadow-elegant relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 gradient-primary opacity-20 blur-3xl rounded-full" />
        <div className="relative flex flex-wrap items-start gap-6 justify-between">
          <div>
            <div className="text-5xl">{trip.cover_emoji}</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">{trip.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {trip.destination}</span>
              {trip.start_date && (
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />
                  {format(new Date(trip.start_date), "MMM d")}{trip.end_date ? ` → ${format(new Date(trip.end_date), "MMM d, yyyy")}` : ""}
                </span>
              )}
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {trip.travelers}</span>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 min-w-[200px]">
            <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Budget</div>
            <div className="mt-1.5 text-2xl font-semibold tracking-tight">{inr(Number(trip.budget_inr))}</div>
            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${remaining < 0 ? "bg-destructive" : "gradient-primary"}`}
                style={{ width: `${Math.min(100, (totalSpent / Math.max(1, Number(trip.budget_inr))) * 100)}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>Spent {inr(totalSpent)}</span>
              <span className={remaining < 0 ? "text-destructive" : "text-accent"}>{inr(remaining)} left</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Day tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {days.map((d) => (
          <button key={d} onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeDay === d ? "gradient-primary text-white glow-primary" : "glass hover:bg-white/10"}`}
          >Day {d}</button>
        ))}
        <button onClick={addDay} className="px-3 py-2 rounded-full glass text-sm hover:bg-white/10 transition">
          <Plus className="w-4 h-4" />
        </button>
        <div className="ml-auto text-xs text-muted-foreground">
          Drag <GripVertical className="inline w-3 h-3" /> to reorder
        </div>
      </div>

      {/* Timeline */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={dayStops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="relative pl-6">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-primary/40 to-transparent" />
            <AnimatePresence>
              {dayStops.map((s, i) => (
                <StopRow key={s.id} stop={s} idx={i} onUpdate={updateStop} onRemove={removeStop} />
              ))}
            </AnimatePresence>
            {dayStops.length === 0 && (
              <div className="text-center py-10 text-sm text-muted-foreground glass rounded-2xl">
                No stops yet for Day {activeDay}.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center justify-between gap-3">
        <button onClick={addStop}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-full gradient-primary text-white glow-primary"
        >
          <Plus className="w-4 h-4" /> Add stop to Day {activeDay}
        </button>
        <button onClick={deleteTrip}
          className="inline-flex items-center gap-1.5 text-sm text-destructive/80 hover:text-destructive px-3 py-2 rounded-full hover:bg-destructive/10 transition"
        >
          <Trash2 className="w-4 h-4" /> Delete trip
        </button>
      </div>
    </div>
  );
}

function StopRow({
  stop, idx, onUpdate, onRemove,
}: { stop: Stop; idx: number; onUpdate: (id: string, patch: Partial<Stop>) => void; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 30 : 1 };

  return (
    <motion.div
      ref={setNodeRef} style={style}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ delay: idx * 0.04 }}
      className={`relative mb-3 ${isDragging ? "opacity-90" : ""}`}
    >
      <div className="absolute -left-[18px] top-5 w-3 h-3 rounded-full gradient-primary glow-primary ring-4 ring-background" />
      <div className="glass-strong rounded-2xl p-4 group hover:border-accent/30 transition-colors">
        <div className="flex items-start gap-3">
          <button {...attributes} {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <input
                value={stop.title}
                onChange={(e) => onUpdate(stop.id, { title: e.target.value })}
                className="font-medium bg-transparent border-none outline-none text-base flex-1 min-w-0 focus:ring-1 focus:ring-accent/50 rounded px-1 -mx-1"
              />
              <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                {CAT_ICONS[stop.category ?? "sightseeing"]} {stop.category}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                <input type="time" value={stop.time ?? ""} onChange={(e) => onUpdate(stop.id, { time: e.target.value })}
                  className="bg-transparent border-none outline-none text-xs [color-scheme:dark]" />
              </span>
              <span className="flex items-center gap-1 flex-1 min-w-[120px]"><MapPin className="w-3 h-3" />
                <input value={stop.location ?? ""} onChange={(e) => onUpdate(stop.id, { location: e.target.value })}
                  placeholder="Location"
                  className="bg-transparent border-none outline-none text-xs flex-1 min-w-0" />
              </span>
              <span className="flex items-center gap-1">₹
                <input type="number" value={stop.cost_inr} onChange={(e) => onUpdate(stop.id, { cost_inr: Number(e.target.value) })}
                  className="bg-transparent border-none outline-none text-xs w-20" />
              </span>
            </div>
          </div>
          <button onClick={() => onRemove(stop.id)}
            className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
