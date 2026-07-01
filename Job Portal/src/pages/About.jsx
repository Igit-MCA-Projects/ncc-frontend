import PublicLayout from "../layouts/PublicLayout";
import { Shield, Users, Target, Sparkles } from "lucide-react";

const values = [
  { icon: Shield, title: "Cadet-first", desc: "Built around what NCC cadets uniquely bring to the table." },
  { icon: Sparkles, title: "AI, transparent", desc: "Every match comes with a reason — and a path to improve." },
  { icon: Users, title: "Community", desc: "From cadets, for cadets — with mentors who've been there." },
  { icon: Target, title: "Outcome-focused", desc: "We win when you land a role you love." },
];

export default function About() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-10 text-center">
        <span className="chip">About</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-display font-extrabold">A career platform built for cadets.</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          NCC Career AI helps cadets translate years of discipline, leadership and training into careers they're proud of —
          with AI that understands their full story.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card-soft p-6">
              <div className="h-11 w-11 rounded-xl hero-gradient grid place-items-center">
                <v.icon className="h-5 w-5 text-white"/>
              </div>
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
