import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="pricing" className="py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-strong rounded-[2rem] p-12 md:p-20 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-40 blur-3xl animate-pulse-glow"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative">
            <h2 className="text-balance text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-5">
              Your next trip starts{" "}
              <span className="gradient-text">tonight.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-9">
              Join thousands of travelers planning smarter, together.
              Free to start — no credit card required.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full gradient-primary text-white font-medium glow-primary hover:scale-[1.03] transition-transform"
            >
              Plan my first trip
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
