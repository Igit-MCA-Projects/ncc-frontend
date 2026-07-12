import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DashboardLayout from "../layouts/DashboardLayout";
import { getStudentContext } from "../services/api";

/* ─────────────────────────────────────────────
   Gemini SDK init
───────────────────────────────────────────── */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINAI_API_KEY);
const MODEL = import.meta.env.VITE_GEMINAI_MODEL || "gemini-2.5-flash";

/* ─────────────────────────────────────────────
   Build rich system prompt from /student/context
───────────────────────────────────────────── */
function buildSystemPrompt(ctx) {
  // ctx shape: { profile, skills, education, marks, address, preferences, ncc }
  const name      = ctx?.profile?.fullName   || "the student";
  const headline  = ctx?.profile?.headline   || "";
  const bio       = ctx?.profile?.bio        || "";

  const skills = ctx?.skills?.length
    ? ctx.skills.join(", ")
    : "not specified";

  // Deduplicate education entries
  const uniqueEdu = [...new Set(ctx?.education || [])];
  const educationLines = uniqueEdu.map((edu) => {
    const score = ctx?.marks?.[edu];
    const scoreStr = score !== undefined
      ? (score <= 10 ? ` (CGPA: ${score})` : ` (${score}%)`)
      : "";
    return `  - ${edu}${scoreStr}`;
  }).join("\n") || "  - Not specified";

  const address   = ctx?.address?.state || "not specified";

  const prefs     = ctx?.preferences || {};
  const prefRole  = prefs.preferredRole         || "not specified";
  const prefLoc   = prefs.preferredLocation?.join(", ") || "not specified";
  const salary    = prefs.expectedSalary
    ? `₹${(prefs.expectedSalary / 100000).toFixed(1)} LPA`
    : "not specified";
  const relocate  = prefs.willingToRelocate  ? "Yes" : "No";
  const remote    = prefs.openToRemote       ? "Yes" : "No";

  const ncc       = ctx?.ncc || {};
  const nccBlock  = ncc.isCompleted
    ? `- **NCC Rank:** ${ncc.rank || "N/A"}
- **NCC Certificate:** ${ncc.certificate || "N/A"}
- **Battalion / Unit:** ${ncc.battalion || "N/A"} / ${ncc.unit || "N/A"}
- **Directorate:** ${ncc.director || "N/A"}`
    : "- NCC data not yet filled";

  return `You are **NCC Career AI** — an expert career guidance assistant exclusively for NCC cadets on the NCC Job Portal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDENT PROFILE (use this as your primary context)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- **Name:** ${name}
${headline ? `- **Headline:** ${headline}` : ""}
${bio       ? `- **Bio:** ${bio}` : ""}
- **Skills:** ${skills}
- **Education:**
${educationLines}
- **Current Location:** ${address}
- **Preferred Role:** ${prefRole}
- **Preferred Locations:** ${prefLoc}
- **Expected Salary:** ${salary}
- **Willing to Relocate:** ${relocate} | **Open to Remote:** ${remote}
${nccBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT SCOPE — READ CAREFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You ONLY answer questions related to:
1. **Job recommendations** — personalised to the student's skills, education, location preferences, and NCC background. Always include: Role, Company, Location, Salary range, and a direct **apply/careers link**.
2. **Career guidance** — resume advice, LinkedIn optimisation, switching fields, salary negotiation.
3. **Interview & exam preparation** — tips, roadmaps, and practice resources matched to the student's target roles.
4. **Learning resources** — YouTube channels, free/paid courses, documentation, GitHub repos. Always include **clickable links**.
5. **NCC-specific advantages** — government quota, defence PSUs, NCC certificate weightage, SSB prep.

⛔ STRICT RULE: If the user asks ANYTHING outside career, jobs, or professional development — such as general knowledge, coding help, personal advice, or anything unrelated — respond ONLY with this exact message and NOTHING else:
"⚠️ I can only assist with career guidance, job recommendations, and preparation resources. Please ask a career-related question!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE FORMAT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use markdown with **bold**, bullet points, and numbered lists.
- Job listings: always include **Role**, **Company**, **Location**, **Salary**, **Apply Link**.
- Resources: always include **Title**, **Platform**, **Link**.
- Keep responses focused and practical — no filler, no disclaimers.
- Prefer Indian job market unless the student asks otherwise.
- Leverage the student's NCC background whenever relevant (defence roles, govt jobs, leadership roles).`;
}

/* ─────────────────────────────────────────────
   Lightweight markdown renderer for chat bubbles
───────────────────────────────────────────── */
function renderText(text) {
  const parts = [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let last = 0, match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={last}>{renderInline(text.slice(last, match.index))}</span>);
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[color:var(--ncc-army)] underline underline-offset-2 font-medium hover:opacity-80 transition-opacity break-all"
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(<span key={last}>{renderInline(text.slice(last))}</span>);
  }
  return parts;
}

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

function MessageContent({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-1" />;
        if (t.startsWith("### ")) return <p key={i} className="font-bold text-[15px] mt-2">{renderText(t.slice(4))}</p>;
        if (t.startsWith("## "))  return <p key={i} className="font-bold text-[15px] mt-2">{renderText(t.slice(3))}</p>;
        if (t.startsWith("# "))   return <p key={i} className="font-bold text-base mt-2">{renderText(t.slice(2))}</p>;
        if (t.startsWith("━"))    return <hr key={i} className="border-border/60 my-1" />;
        if (t.startsWith("- ") || t.startsWith("* "))
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current shrink-0 opacity-50" />
              <span>{renderText(t.slice(2))}</span>
            </div>
          );
        if (/^\d+\.\s/.test(t)) {
          const idx = t.indexOf(". ");
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="font-semibold shrink-0 opacity-60">{t.slice(0, idx + 1)}</span>
              <span>{renderText(t.slice(idx + 2))}</span>
            </div>
          );
        }
        return <p key={i}>{renderText(line)}</p>;
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Suggestion chips
───────────────────────────────────────────── */
const CHIPS = [
  "What jobs match my profile?",
  "Best YouTube channels for interview prep",
  "How does my NCC certificate help in govt jobs?",
  "How to improve my resume for my target role?",
  "Top companies hiring freshers in my preferred location",
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function CareerAssistant() {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [ctxLoading, setCtxLoading] = useState(true);   // fetching student context
  const [ctxError, setCtxError]     = useState(null);
  const [error, setError]           = useState(null);

  const chatRef     = useRef(null);  // Gemini chat session
  const studentCtx  = useRef(null);  // cached /student/context data
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  /* ── Init Gemini chat ── */
  const initChat = useCallback((ctx) => {
    const systemPrompt = buildSystemPrompt(ctx);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemPrompt,
    });
    chatRef.current = model.startChat({
      history: [],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    });

    const name = ctx?.profile?.fullName || "Cadet";
    setMessages([
      {
        id: "init",
        role: "assistant",
        text: `Hello **${name}**! 👋 I'm your **NCC Career AI Assistant**.\n\nI've loaded your profile — here's what I know about you:\n- 🎯 **Preferred Role:** ${ctx?.preferences?.preferredRole || "not set"}\n- 🛠️ **Skills:** ${ctx?.skills?.join(", ") || "not set"}\n- 📍 **Preferred Locations:** ${ctx?.preferences?.preferredLocation?.join(", ") || "not set"}\n- 🏅 **NCC:** ${ctx?.ncc?.rank || "not set"} · ${ctx?.ncc?.certificate || ""}\n\nAsk me anything about jobs, preparation resources, or career guidance!`,
      },
    ]);
  }, []);

  /* ── Fetch student context, then init chat ── */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setCtxLoading(true);
      setCtxError(null);
      try {
        const ctx = await getStudentContext();
        if (cancelled) return;
        studentCtx.current = ctx;
        initChat(ctx);
      } catch (err) {
        if (cancelled) return;
        console.error("Student context fetch failed:", err);
        setCtxError(err.message || "Failed to load your profile context.");
        // Still init chat with empty context as fallback
        initChat(null);
      } finally {
        if (!cancelled) setCtxLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [initChat]);

  /* ── Send message ── */
  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading || ctxLoading) return;
    setInput("");
    setError(null);

    setMessages((m) => [...m, { id: Date.now(), role: "user", text: msg }]);
    setLoading(true);

    try {
      if (!chatRef.current) initChat(studentCtx.current);
      const result  = await chatRef.current.sendMessage(msg);
      const aiText  = result.response.text();
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: aiText }]);
    } catch (err) {
      console.error("Gemini error:", err);
      setError(
        err?.message?.includes("API_KEY")
          ? "Invalid Gemini API key. Check your .env file."
          : "Failed to get a response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleReset = () => {
    initChat(studentCtx.current);
    setError(null);
  };

  const isEmpty = messages.length <= 1;

  /* ── Loading skeleton ── */
  if (ctxLoading) {
    return (
      <DashboardLayout>
        <div className="mb-5">
          <h1 className="text-2xl font-display font-extrabold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[color:var(--ncc-gold)]" />
            Career Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-powered career guidance tailored to your NCC profile
          </p>
        </div>
        <div
          className="card-soft flex flex-col items-center justify-center gap-4"
          style={{ height: "calc(100vh - 210px)", minHeight: "400px" }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your profile context…</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[color:var(--ncc-gold)]" />
            Career Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-powered career guidance tailored to your NCC profile
          </p>
        </div>
        <button
          onClick={handleReset}
          title="New conversation"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Context error banner (non-blocking) */}
      {ctxError && (
        <div className="mb-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-600 border border-yellow-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Couldn't load your full profile ({ctxError}). Responses may be less personalised.
          </span>
        </div>
      )}

      {/* Chat card — full width */}
      <div
        className="card-soft flex flex-col overflow-hidden"
        style={{ height: "calc(100vh - 210px)", minHeight: "400px" }}
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border shrink-0 bg-card/60 backdrop-blur-sm">
          <div className="h-9 w-9 rounded-xl hero-gradient grid place-items-center shadow-sm">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">NCC Career AI</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`h-1.5 w-1.5 rounded-full inline-block ${
                  loading ? "bg-yellow-400 animate-pulse" : "bg-green-500"
                }`}
              />
              {loading ? "Thinking…" : "Online · Career & Job Guidance Only"}
            </div>
          </div>
          {/* Profile context pill */}
          {studentCtx.current && (
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
              Profile loaded
            </div>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 scroll-smooth">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`h-8 w-8 rounded-xl grid place-items-center shrink-0 mt-0.5 ${
                  msg.role === "assistant"
                    ? "hero-gradient shadow-sm"
                    : "bg-muted border border-border"
                }`}
              >
                {msg.role === "assistant"
                  ? <Bot  className="h-3.5 w-3.5 text-white" />
                  : <User className="h-3.5 w-3.5 text-muted-foreground" />
                }
              </div>

              <div
                className={`max-w-[80%] sm:max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "hero-gradient text-white rounded-tr-sm"
                    : "bg-muted/70 text-foreground rounded-tl-sm border border-border/50"
                }`}
              >
                {msg.role === "user"
                  ? <p className="text-sm leading-relaxed">{msg.text}</p>
                  : <MessageContent text={msg.text} />
                }
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="h-8 w-8 rounded-xl hero-gradient grid place-items-center shrink-0 shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/70 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* API error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-200"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Suggestion chips */}
        <AnimatePresence>
          {isEmpty && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="px-4 sm:px-6 pb-2 flex flex-wrap gap-2 shrink-0"
            >
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="text-xs px-3.5 py-1.5 rounded-full border border-border bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="px-4 sm:px-6 pb-4 pt-3 shrink-0 border-t border-border bg-card/40">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={ctxLoading}
              placeholder="Ask about jobs, preparation resources, or career guidance…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-transparent focus:border-border focus:bg-card focus:outline-none text-sm resize-none leading-relaxed overflow-hidden disabled:opacity-50"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading || ctxLoading}
              className="h-10 w-10 rounded-xl hero-gradient grid place-items-center disabled:opacity-40 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-sm"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Career &amp; job guidance only · Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
