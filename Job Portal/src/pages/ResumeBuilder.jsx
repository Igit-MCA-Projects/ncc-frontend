import { useState, useRef, useCallback } from "react";
import html2pdf from "html2pdf.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  User, FileText, BookOpen, Zap, Briefcase, FolderOpen, Award,
  Plus, Trash2, Eye, EyeOff, Download, ChevronLeft, ChevronRight,
  LayoutTemplate, Sparkles, PlusCircle, RotateCcw, Check, Globe, Languages,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { ResumeProvider, useResume } from "../context/ResumeContext";
import TemplateClassic from "../components/resume/templates/TemplateClassic";
import TemplateModern from "../components/resume/templates/TemplateModern";
import TemplateNCC from "../components/resume/templates/TemplateNCC";
import TemplateElegant from "../components/resume/templates/TemplateElegant";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const personalSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional(),
});

// ─── AI Stub Button ───────────────────────────────────────────────────────────
function AIButton() {
  return (
    <button
      type="button"
      onClick={() => toast("✨ AI integration coming soon!", { icon: "🤖" })}
      className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted hover:bg-accent/20 border border-border px-1.5 py-0.5 rounded-md transition-colors shrink-0"
    >
      <Sparkles className="h-2.5 w-2.5 text-[color:var(--ncc-gold)]" />
      AI
    </button>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────
function FieldRow({ label, children, showAI = true }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wide">{label}</label>
          {showAI && <AIButton />}
        </div>
      )}
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors placeholder:text-muted-foreground/40";
const textareaCls =
  "w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors resize-none placeholder:text-muted-foreground/40";

// ─── STEP 1: Personal ─────────────────────────────────────────────────────────
function StepPersonal() {
  const { resume, updatePersonal } = useResume();
  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: resume.personal,
  });
  const ch = (field) => (e) => updatePersonal({ [field]: e.target.value });

  return (
    <div className="space-y-2.5">
      <FieldRow label="Full Name" showAI={false}>
        <input {...register("fullName")} onChange={ch("fullName")} defaultValue={resume.personal.fullName} className={inputCls} placeholder="Subha Prakash Rout" />
        {errors.fullName && <p className="text-[10px] text-destructive">{errors.fullName.message}</p>}
      </FieldRow>
      <div className="grid grid-cols-2 gap-2">
        <FieldRow label="Email">
          <input onChange={ch("email")} defaultValue={resume.personal.email} className={inputCls} placeholder="you@email.com" />
        </FieldRow>
        <FieldRow label="Phone" showAI={false}>
          <input onChange={ch("phone")} defaultValue={resume.personal.phone} className={inputCls} placeholder="+91 9876543210" />
        </FieldRow>
      </div>
      <FieldRow label="Address" showAI={false}>
        <input onChange={ch("address")} defaultValue={resume.personal.address} className={inputCls} placeholder="Odisha, India, 755049" />
      </FieldRow>
      <div className="grid grid-cols-2 gap-2">
        <FieldRow label="LinkedIn">
          <input onChange={ch("linkedin")} defaultValue={resume.personal.linkedin} className={inputCls} placeholder="username" />
        </FieldRow>
        <FieldRow label="GitHub">
          <input onChange={ch("github")} defaultValue={resume.personal.github} className={inputCls} placeholder="username" />
        </FieldRow>
      </div>
      <FieldRow label="Website / Portfolio">
        <input onChange={ch("website")} defaultValue={resume.personal.website} className={inputCls} placeholder="https://yourportfolio.com" />
      </FieldRow>
    </div>
  );
}

// ─── STEP 2: Summary ──────────────────────────────────────────────────────────
function StepSummary() {
  const { resume, updateSummary } = useResume();
  return (
    <div className="space-y-2.5">
      <FieldRow label="Professional Summary">
        <textarea className={textareaCls} rows={7} defaultValue={resume.summary} onChange={(e) => updateSummary(e.target.value)} placeholder="B.Tech Computer Science Engineer specializing in full-stack web development..." />
      </FieldRow>
    </div>
  );
}

// ─── STEP 3: Education ────────────────────────────────────────────────────────
function StepEducation() {
  const { resume, updateSection } = useResume();
  const items = resume.education || [];
  const add = () => updateSection("education", [...items, { id: Date.now(), school: "", degree: "", cgpa: "", startYear: "", endYear: "", description: "" }]);
  const remove = (id) => updateSection("education", items.filter((i) => i.id !== id));
  const upd = (id, f, v) => updateSection("education", items.map((i) => (i.id === id ? { ...i, [f]: v } : i)));

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="p-3 border border-border rounded-xl bg-muted/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary">Education #{idx + 1}</span>
            <button type="button" onClick={() => remove(item.id)} className="text-destructive p-1 rounded transition-colors hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <FieldRow label="School / University" showAI={false}>
            <input className={inputCls} defaultValue={item.school} onChange={(e) => upd(item.id, "school", e.target.value)} placeholder="DRIEMS University" />
          </FieldRow>
          <FieldRow label="Degree">
            <input className={inputCls} defaultValue={item.degree} onChange={(e) => upd(item.id, "degree", e.target.value)} placeholder="Bachelor of Technology" />
          </FieldRow>
          <div className="grid grid-cols-3 gap-2">
            <FieldRow label="Score/CGPA" showAI={false}>
              <input className={inputCls} defaultValue={item.cgpa} onChange={(e) => upd(item.id, "cgpa", e.target.value)} placeholder="7.0" />
            </FieldRow>
            <FieldRow label="Start Year" showAI={false}>
              <input className={inputCls} defaultValue={item.startYear} onChange={(e) => upd(item.id, "startYear", e.target.value)} placeholder="2022" />
            </FieldRow>
            <FieldRow label="End Year" showAI={false}>
              <input className={inputCls} defaultValue={item.endYear} onChange={(e) => upd(item.id, "endYear", e.target.value)} placeholder="2026" />
            </FieldRow>
          </div>
          <FieldRow label="Description (one bullet per line)">
            <textarea className={textareaCls} rows={3} defaultValue={item.description} onChange={(e) => upd(item.id, "description", e.target.value)} placeholder={"Pursued a Bachelor of Technology degree in Computer Science...\nAchieved a commendable 7.0 CGPA."} />
          </FieldRow>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all">
        <Plus className="h-3.5 w-3.5" /> Add Education
      </button>
    </div>
  );
}

// ─── STEP 4: Skills ──────────────────────────────────────────────────────────
function StepSkills() {
  const { resume, updateSection } = useResume();
  const [input, setInput] = useState("");
  const items = resume.skills || [];
  const add = () => { const t = input.trim(); if (!t) return; updateSection("skills", [...items, t]); setInput(""); };
  const remove = (idx) => updateSection("skills", items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2.5">
      <FieldRow label="Add Skills" showAI={false}>
        <div className="flex gap-1.5">
          <input className={inputCls} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder="React, Node.js, Python… (Enter to add)" />
          <button type="button" onClick={add} className="shrink-0 btn-primary px-3 py-1.5 rounded-lg text-xs"><Plus className="h-3.5 w-3.5" /></button>
          <AIButton />
        </div>
      </FieldRow>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2.5 border border-border rounded-xl bg-muted/10 min-h-[44px]">
          {items.map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {typeof skill === "string" ? skill : skill.name}
              <button type="button" onClick={() => remove(i)} className="opacity-60 hover:opacity-100"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STEP 5: Experience ──────────────────────────────────────────────────────
function StepExperience() {
  const { resume, updateSection } = useResume();
  const items = resume.experience || [];
  const add = () => updateSection("experience", [...items, { id: Date.now(), role: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }]);
  const remove = (id) => updateSection("experience", items.filter((i) => i.id !== id));
  const upd = (id, f, v) => updateSection("experience", items.map((i) => (i.id === id ? { ...i, [f]: v } : i)));

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="p-3 border border-border rounded-xl bg-muted/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary">Experience #{idx + 1}</span>
            <button type="button" onClick={() => remove(item.id)} className="text-destructive p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Job Title">
              <input className={inputCls} defaultValue={item.role} onChange={(e) => upd(item.id, "role", e.target.value)} placeholder="Software Engineer" />
            </FieldRow>
            <FieldRow label="Company" showAI={false}>
              <input className={inputCls} defaultValue={item.company} onChange={(e) => upd(item.id, "company", e.target.value)} placeholder="Infosys" />
            </FieldRow>
          </div>
          <FieldRow label="Location" showAI={false}>
            <input className={inputCls} defaultValue={item.location} onChange={(e) => upd(item.id, "location", e.target.value)} placeholder="New Delhi" />
          </FieldRow>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Start Date" showAI={false}>
              <input className={inputCls} defaultValue={item.startDate} onChange={(e) => upd(item.id, "startDate", e.target.value)} placeholder="Jan 2023" />
            </FieldRow>
            <FieldRow label="End Date" showAI={false}>
              <input className={inputCls} defaultValue={item.endDate} disabled={item.current} onChange={(e) => upd(item.id, "endDate", e.target.value)} placeholder="Dec 2024" />
            </FieldRow>
          </div>
          <label className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground cursor-pointer">
            <input type="checkbox" className="accent-primary" defaultChecked={item.current}
              onChange={(e) => { upd(item.id, "current", e.target.checked); if (e.target.checked) upd(item.id, "endDate", ""); }} />
            Currently working here
          </label>
          <FieldRow label="Description (one bullet per line)">
            <textarea className={textareaCls} rows={3} defaultValue={item.description} onChange={(e) => upd(item.id, "description", e.target.value)} placeholder={"Developed REST APIs using Node.js...\nReduced page load time by 40%."} />
          </FieldRow>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all">
        <Plus className="h-3.5 w-3.5" /> Add Experience
      </button>
    </div>
  );
}

// ─── STEP 6: Projects ────────────────────────────────────────────────────────
function StepProjects() {
  const { resume, updateSection } = useResume();
  const items = resume.projects || [];
  const add = () => updateSection("projects", [...items, { id: Date.now(), title: "", description: "", techStack: "", link: "" }]);
  const remove = (id) => updateSection("projects", items.filter((i) => i.id !== id));
  const upd = (id, f, v) => updateSection("projects", items.map((i) => (i.id === id ? { ...i, [f]: v } : i)));

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="p-3 border border-border rounded-xl bg-muted/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary">Project #{idx + 1}</span>
            <button type="button" onClick={() => remove(item.id)} className="text-destructive p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <FieldRow label="Project Title">
            <input className={inputCls} defaultValue={item.title} onChange={(e) => upd(item.id, "title", e.target.value)} placeholder="NCC Cadet Tracker App" />
          </FieldRow>
          <FieldRow label="Tech Stack" showAI={false}>
            <input className={inputCls} defaultValue={item.techStack} onChange={(e) => upd(item.id, "techStack", e.target.value)} placeholder="React, Node.js, MongoDB" />
          </FieldRow>
          <FieldRow label="Project Link" showAI={false}>
            <div className="flex gap-1.5 items-center">
              <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input className={inputCls} defaultValue={item.link} onChange={(e) => upd(item.id, "link", e.target.value)} placeholder="github.com/user/project" />
            </div>
          </FieldRow>
          <FieldRow label="Description">
            <textarea className={textareaCls} rows={2} defaultValue={item.description} onChange={(e) => upd(item.id, "description", e.target.value)} placeholder="Describe what this project does..." />
          </FieldRow>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all">
        <Plus className="h-3.5 w-3.5" /> Add Project
      </button>
    </div>
  );
}

// ─── STEP 7: Certifications ──────────────────────────────────────────────────
function StepCertifications() {
  const { resume, updateSection } = useResume();
  const items = resume.certifications || [];
  const add = () => updateSection("certifications", [...items, { id: Date.now(), name: "", issuer: "", year: "", link: "", description: "" }]);
  const remove = (id) => updateSection("certifications", items.filter((i) => i.id !== id));
  const upd = (id, f, v) => updateSection("certifications", items.map((i) => (i.id === id ? { ...i, [f]: v } : i)));

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="p-3 border border-border rounded-xl bg-muted/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary">Certificate #{idx + 1}</span>
            <button type="button" onClick={() => remove(item.id)} className="text-destructive p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <FieldRow label="Certificate Name">
            <input className={inputCls} defaultValue={item.name} onChange={(e) => upd(item.id, "name", e.target.value)} placeholder="Core Java Certification" />
          </FieldRow>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Issuing Authority" showAI={false}>
              <input className={inputCls} defaultValue={item.issuer} onChange={(e) => upd(item.id, "issuer", e.target.value)} placeholder="Computer Application Centre" />
            </FieldRow>
            <FieldRow label="Year" showAI={false}>
              <input className={inputCls} defaultValue={item.year} onChange={(e) => upd(item.id, "year", e.target.value)} placeholder="Sep 2024 – Nov 2024" />
            </FieldRow>
          </div>
          <FieldRow label="Credential Link" showAI={false}>
            <div className="flex gap-1.5 items-center">
              <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input className={inputCls} defaultValue={item.link} onChange={(e) => upd(item.id, "link", e.target.value)} placeholder="https://credential.link" />
            </div>
          </FieldRow>
          <FieldRow label="Description (one bullet per line)">
            <textarea className={textareaCls} rows={2} defaultValue={item.description} onChange={(e) => upd(item.id, "description", e.target.value)} placeholder={"Acquired in-depth knowledge of OOP principles...\nDeveloped proficiency in building robust applications."} />
          </FieldRow>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all">
        <Plus className="h-3.5 w-3.5" /> Add Certification
      </button>
    </div>
  );
}

// ─── STEP 8: Languages ───────────────────────────────────────────────────────
function StepLanguages() {
  const { resume, updateSection } = useResume();
  const items = resume.languages || [];
  const add = () => updateSection("languages", [...items, { id: Date.now(), name: "", level: "Advanced" }]);
  const remove = (id) => updateSection("languages", items.filter((i) => i.id !== id));
  const upd = (id, f, v) => updateSection("languages", items.map((i) => (i.id === id ? { ...i, [f]: v } : i)));

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="p-3 border border-border rounded-xl bg-muted/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary">Language #{idx + 1}</span>
            <button type="button" onClick={() => remove(item.id)} className="text-destructive p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Language" showAI={false}>
              <input className={inputCls} defaultValue={item.name} onChange={(e) => upd(item.id, "name", e.target.value)} placeholder="English" />
            </FieldRow>
            <FieldRow label="Proficiency" showAI={false}>
              <select className={inputCls} defaultValue={item.level} onChange={(e) => upd(item.id, "level", e.target.value)}>
                <option>Native</option>
                <option>Advanced</option>
                <option>Intermediate</option>
                <option>Beginner</option>
              </select>
            </FieldRow>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all">
        <Plus className="h-3.5 w-3.5" /> Add Language
      </button>
    </div>
  );
}

// ─── STEP 9: Custom Sections ─────────────────────────────────────────────────
function StepCustom() {
  const { resume, addCustomSection, updateCustomSection, removeCustomSection } = useResume();
  const items = resume.customSections || [];
  const [newTitle, setNewTitle] = useState("");

  const add = () => {
    if (!newTitle.trim()) { toast.error("Section title is required"); return; }
    addCustomSection({ id: Date.now(), title: newTitle.trim(), content: "" });
    setNewTitle("");
  };

  return (
    <div className="space-y-3">
      <div className="p-3 border border-dashed border-border rounded-xl bg-muted/10 space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground">Add a custom section (e.g. Languages, Awards, NCC Service)</p>
        <div className="flex gap-1.5">
          <input className={inputCls} value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Section title…" />
          <button type="button" onClick={add} className="shrink-0 btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {items.map((sec) => (
        <div key={sec.id} className="p-3 border border-border rounded-xl bg-muted/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary">{sec.title}</span>
            <button type="button" onClick={() => removeCustomSection(sec.id)} className="text-destructive p-1 rounded hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <FieldRow label="Content">
            <textarea className={textareaCls} rows={3} defaultValue={sec.content} onChange={(e) => updateCustomSection(sec.id, { content: e.target.value })} placeholder="Content for this section…" />
          </FieldRow>
        </div>
      ))}
      {items.length === 0 && <div className="py-6 text-center text-xs text-muted-foreground italic">No custom sections yet.</div>}
    </div>
  );
}

// ─── Steps Config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: "personal", label: "Personal", short: "P", icon: User, component: StepPersonal, sectionKey: null },
  { id: "summary", label: "Summary", short: "S", icon: FileText, component: StepSummary, sectionKey: "summary" },
  { id: "education", label: "Education", short: "Edu", icon: BookOpen, component: StepEducation, sectionKey: "education" },
  { id: "skills", label: "Skills", short: "Sk", icon: Zap, component: StepSkills, sectionKey: "skills" },
  { id: "experience", label: "Experience", short: "Exp", icon: Briefcase, component: StepExperience, sectionKey: "experience" },
  { id: "projects", label: "Projects", short: "Proj", icon: FolderOpen, component: StepProjects, sectionKey: "projects" },
  { id: "certifications", label: "Certs", short: "Cert", icon: Award, component: StepCertifications, sectionKey: "certifications" },
  { id: "languages", label: "Languages", short: "Lang", icon: Languages, component: StepLanguages, sectionKey: "languages" },
  { id: "custom", label: "Custom", short: "+", icon: PlusCircle, component: StepCustom, sectionKey: null },
];

const TEMPLATES = [
  { id: "sidebar", label: "Sidebar", component: TemplateClassic },
  { id: "centered", label: "Centered", component: TemplateModern },
  { id: "compact", label: "Compact", component: TemplateNCC },
  { id: "elegant", label: "Elegant", component: TemplateElegant },
];

// ─── Inner ─────────────────────────────────────────────────────────────────
function ResumeBuilderInner() {
  const { resume, toggleHideSection, resetResume } = useResume();
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("sidebar");
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const currentStep = STEPS[step];
  const StepComponent = currentStep.component;

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const opt = {
        margin: 0,
        filename: `${resume.personal.fullName || "resume"}_resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(previewRef.current).save();
      toast.success("PDF downloaded!");
    } catch (e) {
      toast.error("PDF generation failed");
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const ActiveTemplate = TEMPLATES.find((t) => t.id === template)?.component || TemplateClassic;

  return (
    // Outer: fixed height to fit viewport
    <div className="flex flex-col" style={{ height: "calc(100vh - 8.5rem)" }}>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <h1 className="text-lg font-display font-extrabold leading-tight">Resume Builder</h1>
          <p className="text-[11px] text-muted-foreground">Live preview · Auto-saved · PDF export</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (confirm("Reset all resume data?")) { resetResume(); toast.success("Resume reset"); } }}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground border border-border px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button onClick={handleDownload} disabled={downloading}
            className="flex items-center gap-1.5 btn-primary text-xs px-3 py-2 rounded-xl disabled:opacity-50">
            <Download className="h-3.5 w-3.5" />
            {downloading ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </div>

      {/* ── Two-column layout — fills remaining viewport ── */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* ══ LEFT: Form Panel ══ */}
        <div className="w-[44%] xl:w-[40%] shrink-0 flex flex-col gap-2 min-h-0">
          {/* Step Tabs */}
          <div className="card-soft p-1.5 flex flex-wrap gap-1 shrink-0">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setStep(i)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    step === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  <Icon className="h-2.5 w-2.5 shrink-0" />
                  <span className="hidden md:inline">{s.short}</span>
                </button>
              );
            })}
          </div>

          {/* Form Card — scrollable */}
          <div className="card-soft flex-1 min-h-0 flex flex-col">
            {/* Card header */}
            <div className="px-4 py-2.5 border-b border-border shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => { const Icon = currentStep.icon; return <Icon className="h-3.5 w-3.5 text-primary" />; })()}
                <span className="text-sm font-bold">{currentStep.label}</span>
              </div>
              {currentStep.sectionKey && (
                <button onClick={() => toggleHideSection(currentStep.sectionKey)}
                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                    (resume.hiddenSections || []).includes(currentStep.sectionKey)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}>
                  {(resume.hiddenSections || []).includes(currentStep.sectionKey)
                    ? <><EyeOff className="h-3 w-3" /> Hidden</>
                    : <><Eye className="h-3 w-3" /> Visible</>}
                </button>
              )}
            </div>
            {/* Scrollable form body */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                  <StepComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between shrink-0">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
              className="flex items-center gap-1 text-xs font-semibold btn-outline px-3 py-1.5 rounded-xl disabled:opacity-30">
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <button key={i} onClick={() => setStep(i)}
                  className={`rounded-full transition-all ${i === step ? "h-2 w-5 bg-primary" : "h-2 w-2 bg-border hover:bg-muted-foreground"}`} />
              ))}
            </div>
            <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
              className="flex items-center gap-1 text-xs font-semibold btn-primary px-3 py-1.5 rounded-xl disabled:opacity-30">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ══ RIGHT: Preview Panel ══ */}
        <div className="flex-1 min-w-0 flex flex-col gap-2 min-h-0">
          {/* Template Switcher */}
          <div className="card-soft p-1.5 flex items-center gap-1.5 shrink-0 flex-wrap">
            <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
            <span className="text-[10px] font-semibold text-muted-foreground mr-1">Template:</span>
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  template === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}>
                {template === t.id && <Check className="h-2.5 w-2.5" />}
                {t.label}
              </button>
            ))}
          </div>

          {/* A4 Preview — scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto rounded-xl bg-[#d0cece]">
            <div className="p-4 flex justify-center min-h-full">
              <div
                ref={previewRef}
                style={{
                  width: "210mm",
                  maxWidth: "100%",
                  minHeight: "297mm",
                  background: "#fff",
                  boxShadow: "0 2px 24px rgba(0,0,0,0.20)",
                  border: "1px solid #ccc",
                }}
              >
                <ActiveTemplate resume={resume} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  return (
    <ResumeProvider>
      <DashboardLayout>
        <ResumeBuilderInner />
      </DashboardLayout>
    </ResumeProvider>
  );
}
