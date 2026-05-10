import { motion } from "framer-motion";
import { Plane, LogOut } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,calc(100%-2rem))]"
    >
      <div className="glass-strong rounded-full px-5 py-2.5 flex items-center justify-between shadow-soft">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="font-semibold tracking-tight text-[1.05rem]">Traveloop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <Link to="/dashboard" className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-full transition-colors">Dashboard</Link>
          )}
          <a href="/#features" className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-full transition-colors">Features</a>
          <a href="/#how" className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-full transition-colors">How it works</a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/trips/new" className="text-sm font-medium px-4 py-1.5 rounded-full gradient-primary text-white hover:opacity-90 transition-opacity glow-primary">
                New trip
              </Link>
              <button
                onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                className="hidden sm:inline-flex items-center gap-1 text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-flex text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
              <Link to="/signup" className="text-sm font-medium px-4 py-1.5 rounded-full gradient-primary text-white hover:opacity-90 transition-opacity glow-primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
