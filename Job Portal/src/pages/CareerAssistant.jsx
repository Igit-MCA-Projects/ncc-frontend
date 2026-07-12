import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  AlertTriangle,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { ResumeContext } from "../context/ResumeContext";

/* ─────────────────────────────────────────────
   Gemini SDK init
───────────────────────────────────────────── */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINAI_API_KEY);
const MODEL = import.meta.env.VITE_GEMINAI_MODEL || "gemini-2.5-flash";

/* ─────────────────────────────────────────────
   Build the system prompt from student context
───────────────────────────────────────────── */
function buildSystemPrompt(user, profile, resume) {
  const name = profile?.fullName || user?.fullName || user?.name || "the student";
  const skills =
    resume?.skills?.length
      ? resume.skills.map((s) => (typeof s === "string" ? s : s.name || s.skill)).join(", ")
      : profile?.skills?.join(", ") || "not specified";

  const qualifications =
    resume?.education?.length
      ? resume.education
          .map((e) => `${e.degree || e.qualification || ""} from ${e.institution || e.school || ""}`)
          .filter(Boolean)
          .join("; ")
      : profile?.qualification || "not specified";

  const experience =
    resume?.experience?.length
      ? resume.experience
          .map((e) => `${e.title || e.role || ""} at ${e.company || ""}`)
          .filter(Boolean)
          .join("; ")
      : "fresher / not specified";

  const certifications =
    resume?.certifications?.length
      ? resume.certifications.map((c) => c.name || c.title || c).join(", ")
      : profile?.nccCertificate || "none";

  const summary = resume?.summary || profile?.bio || "";

  return `You are NCC Career AI — a highly specialised career guidance assistant exclusively for NCC cadets and students of the NCC Job Portal.

## Student Profile
- **Name:** ${name}
- **Skills:** ${skills}
- **Education / Qualifications:** ${qualifications}
- **Work Experience:** ${experience}
- **Certifications / NCC:** ${certifications}
${summary ? `- **Summary:** ${summary}` : ""}

## Your Strict Scope
You ONLY answer questions related to:
1. Career guidance and job recommendations tailored to the student's skills and qualifications above.
2. Specific job opportunities (with company names, roles, salary ranges, and **direct application/career page links** where possible).
3. Interview preparation tips for roles matching the student's profile.
4. Learning resources: YouTube channels, websites, online courses relevant to their career goals. Always include **clickable links** (e.g., YouTube playlist URLs, course URLs, documentation links).
5. Resume and LinkedIn profile advice.
6. NCC-specific career advantages (government roles, defence PSUs, NCC quota, etc.).

## Response Rules
- If the user asks ANYTHING outside career, jobs, or professional development, respond ONLY with this exact message:
  "⚠️ I'm only able to help with career guidance, job recommendations, and preparation resources. Please ask a career-related question!"
- Always format job recommendations as a structured list with: **Role**, **Company**, **Location**, **Salary range**, **Apply link**.
- Always format resource recommendations with: **Title**, **Platform/Channel**, **Link**.
- Use markdown for clarity. Keep responses concise and practical.
- When recommending jobs, personalise based on the student's skills, qualifications, and NCC background.
- Prefer Indian job market unless asked otherwise.`;
}

/* ─────────────────────────────────────────────
   Markdown-light renderer for AI responses
───────────────────────────────────────────── */
function renderText(text) {
  // Convert markdown links [label](url)
  const parts = [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let last = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(
        <span key={last}>{renderInline(text.slice(last, match.index))}</span>
      );
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[color:var(--ncc-army)] underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(
      <span key={last}>{renderInline(text.slice(last))}</span>
    );
  }
  return parts;
}

function renderInline(text) {
  // Bold **text**
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function MessageContent({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Headings ## or ###
        if (trimmed.startsWith("### "))
          return (
            <p key={i} className="font-bold text-base mt-2">
              {renderText(trimmed.slice(4))}
            </p>
          );
        if (trimmed.startsWith("## "))
          return (
            <p key={i} className="font-bold text-base mt-2">
              {renderText(trimmed.slice(3))}
            </p>
          );
        if (trimmed.startsWith("# "))
          return (
            <p key={i} className="font-bold text-lg mt-2">
              {renderText(trimmed.slice(2))}
            </p>
          );

        // Bullet lists - or *
        if (trimmed.startsWith("- ") || trimmed.startsWith("* "))
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0 opacity-60" />
              <span>{renderText(trimmed.slice(2))}</span>
            </div>
          );

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const idx = trimmed.indexOf(". ");
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="font-semibold shrink-0 opacity-70">
                {trimmed.slice(0, idx + 1)}
              </span>
              <span>{renderText(trimmed.slice(idx + 2))}</span>
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
  "What jobs match my skills?",
  "Best YouTube channels for DSA prep",
  "How to use my NCC certificate for government jobs?",
  "Improve my resume for tech roles",
  "Top companies hiring freshers in India",
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function CareerAssistant() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const resumeCtx = useContext(ResumeContext); // null if not inside ResumeProvider
  const resume = resumeCtx?.resume ?? null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatRef = useRef(null); // Gemini chat session
  const bottomRef = useRef(null);
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

  /* Init Gemini chat with system prompt */
  const initChat = useCallback(() => {
    const systemPrompt = buildSystemPrompt(user, profile, resume);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemPrompt,
    });
    chatRef.current = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const name =
      profile?.fullName || user?.fullName || user?.name || "Cadet";
    setMessages([
      {
        id: "init",
        role: "assistant",
        text: `Hello **${name}**! 👋 I'm your **NCC Career AI Assistant**.\n\nI'm here to help you with:\n- 🎯 Job recommendations matching your profile\n- 📚 Preparation resources & learning paths\n- 🏅 Making the most of your NCC background\n- 📝 Resume and interview guidance\n\nWhat career question can I help you with today?`,
      },
    ]);
  }, [user, profile, resume]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  /* Send message */
  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setError(null);

    const userMsg = { id: Date.now(), role: "user", text: msg };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      if (!chatRef.current) initChat();
      const result = await chatRef.current.sendMessage(msg);
      const aiText = result.response.text();
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: "assistant", text: aiText },
      ]);
    } catch (err) {
      console.error("Gemini error:", err);
      setError(
        err?.message?.includes("API_KEY")
          ? "Invalid Gemini API key. Please check your .env file."
          : "Failed to get a response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleReset = () => {
    initChat();
    setError(null);
  };

  const isEmpty = messages.length <= 1;

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

      {/* Chat card — full width */}
      <div
        className="card-soft flex flex-col overflow-hidden"
        style={{ height: "calc(100vh - 210px)", minHeight: "400px" }}
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border shrink-0 bg-card/60 backdrop-blur-sm">
          <div className="h-9 w-9 rounded-xl hero-gradient grid place-items-center shadow-sm">
            <Bot className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">NCC Career AI</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`h-1.5 w-1.5 rounded-full inline-block ${
                  loading ? "bg-yellow-400 animate-pulse" : "bg-green-500"
                }`}
              />
              {loading ? "Thinking…" : "Online · Career & Job Guidance"}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 scroll-smooth">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-xl grid place-items-center shrink-0 mt-0.5 ${
                  msg.role === "assistant"
                    ? "hero-gradient shadow-sm"
                    : "bg-muted border border-border"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="h-3.5 w-3.5 text-white" />
                ) : (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] sm:max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "hero-gradient text-white rounded-tr-sm"
                    : "bg-muted/70 text-foreground rounded-tl-sm border border-border/50"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                ) : (
                  <MessageContent text={msg.text} />
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
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

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-200"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Suggestion chips — shown only when chat is empty */}
        <AnimatePresence>
          {isEmpty && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 sm:px-6 pb-1 flex flex-wrap gap-2 shrink-0"
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
              placeholder="Ask about jobs, preparation resources, or career guidance…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-transparent focus:border-border focus:bg-card focus:outline-none text-sm resize-none leading-relaxed overflow-hidden"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="h-10 w-10 rounded-xl hero-gradient grid place-items-center disabled:opacity-40 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-sm"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Only career, job, and preparation questions are supported · Press Enter to send
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
