import { useState } from "react";
import PublicLayout from "../layouts/PublicLayout";
import { Mail, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e) => {
    e.preventDefault();
    toast.success("Message sent. We'll get back to you soon!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-20 grid gap-10 lg:grid-cols-2">
        <div>
          <span className="chip">Contact</span>
          <h1 className="mt-4 text-4xl font-display font-extrabold">We'd love to hear from you</h1>
          <p className="mt-3 text-muted-foreground max-w-md">
            Have feedback, a partnership idea, or just a hello? Drop us a note.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[color:var(--ncc-maroon)]"/> hello@ncccareer.ai</li>
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-[color:var(--ncc-maroon)]"/> +91 98765 43210</li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[color:var(--ncc-maroon)]"/> New Delhi, India</li>
          </ul>
        </div>

        <form onSubmit={submit} className="card-soft p-6 sm:p-8 space-y-4">
          <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })}/>
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })}/>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</span>
            <textarea
              required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full p-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <button className="btn-primary w-full">Send message</button>
        </form>
      </section>
    </PublicLayout>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"/>
    </label>
  );
}
