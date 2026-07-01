import { Link } from "react-router-dom";
import { Shield, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl hero-gradient grid place-items-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-extrabold">NCC Career AI</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            AI-powered career platform built for NCC cadets. Match smarter. Apply faster.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/jobs" className="hover:text-primary">Jobs</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            <li><Link to="/profile" className="hover:text-primary">Profile</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Follow</h4>
          <div className="flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-primary"><Twitter className="h-5 w-5"/></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-primary"><Linkedin className="h-5 w-5"/></a>
            <a href="#" aria-label="GitHub" className="hover:text-primary"><Github className="h-5 w-5"/></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NCC Career AI · Built with pride for cadets across India.
      </div>
    </footer>
  );
}
