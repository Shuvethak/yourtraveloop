import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Tell us your vibe",
    desc: "Pick your trip mood — adventure, luxury, family, solo. Set dates and budget.",
  },
  {
    n: "02",
    title: "Get an AI itinerary",
    desc: "Traveloop drafts a multi-city plan in seconds, complete with stops and activities.",
  },
  {
    n: "03",
    title: "Tweak together",
    desc: "Drag, drop, and co-edit with friends. Watch the budget and timeline update live.",
  },
  {
    n: "04",
    title: "Pack and go",
    desc: "Auto-checklist, weather-aware reminders, and a beautiful day-by-day journal.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full glass text-xs font-medium text-accent mb-5">
            How it works
          </div>
          <h2 className="text-balance text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            From idea to <span className="gradient-text">boarding pass</span>{" "}
            in minutes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative"
            >
              <div className="text-xs font-mono text-accent mb-4">{s.n}</div>
              <h3 className="font-semibold text-lg mb-2 tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
