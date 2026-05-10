import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-globe.jpg";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl animate-pulse-glow"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-medium mb-7"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-muted-foreground">
              AI-powered itineraries · Now in beta
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-balance text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            Plan trips that feel{" "}
            <span className="gradient-text">unforgettable</span>
            <span className="text-muted-foreground/60"> — together.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-balance text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Traveloop turns scattered ideas into beautifully optimized
            multi-city journeys. AI itineraries, smart budgets, live
            collaboration — all in one premium workspace.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white font-medium glow-primary hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              Start planning free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/[0.06] transition-colors font-medium"
            >
              Watch demo
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 max-w-5xl mx-auto"
        >
          <div className="absolute -inset-8 gradient-primary opacity-30 blur-3xl rounded-full" />
          <div className="relative glass-strong rounded-3xl p-2 shadow-elegant">
            <div className="rounded-2xl overflow-hidden aspect-[16/10] relative">
              <img
                src={heroImg}
                alt="Animated globe showing Traveloop trip routes"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

              {/* Floating UI cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute top-6 left-6 glass-strong rounded-2xl p-4 w-56 hidden sm:block animate-float"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  Trip budget
                </div>
                <div className="text-2xl font-semibold mb-2">$2,840</div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-2/3 gradient-primary rounded-full" />
                </div>
                <div className="text-[11px] text-accent mt-2">
                  ↓ 18% under target
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-8 right-6 glass-strong rounded-2xl p-4 w-64 hidden sm:block animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-sm font-medium">AI suggestion</div>
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Swap Day 4 to Kyoto — saves $220 and adds 2 hidden gems.
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
