import { motion } from "framer-motion";

const stats = [
  { value: "1.2M+", label: "Trips planned" },
  { value: "180+", label: "Countries covered" },
  { value: "$340M", label: "Travel budgets optimized" },
  { value: "4.9★", label: "Average rating" },
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="glass-strong rounded-3xl p-10 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative text-center md:text-left"
            >
              <div className="text-4xl md:text-5xl font-semibold tracking-tight gradient-text mb-1.5">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
