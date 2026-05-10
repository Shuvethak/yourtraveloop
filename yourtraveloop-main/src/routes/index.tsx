import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Traveloop — Personalized Travel Planning Made Easy" },
      {
        name: "description",
        content:
          "AI-powered travel planning workspace. Build multi-city itineraries, optimize budgets, and collaborate with friends in real time.",
      },
      { property: "og:title", content: "Traveloop — Plan trips that feel unforgettable" },
      {
        property: "og:description",
        content:
          "AI itineraries, smart budgets, live collaboration — all in one premium travel workspace.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main id="showcase" className="min-h-screen relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
