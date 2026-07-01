import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Jobs" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl hero-gradient grid place-items-center shadow-md">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-extrabold text-foreground">NCC Career AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Cadet · Career · AI</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
             
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-foreground/80 hover:text-primary">Login</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-1 font-medium">
                {l.label}
              </Link>
            ))}
            {user ? (
              <Link to="/dashboard" className="btn-primary text-center" onClick={() => setOpen(false)}>Dashboard</Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-outline flex-1 text-center" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary flex-1 text-center" onClick={() => setOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
