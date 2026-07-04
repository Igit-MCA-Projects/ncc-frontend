import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, ExternalLink, MapPin, Banknote, Youtube, BookOpen, Globe } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

/* ─────────────────────────────────────────────
   DUMMY DATA
───────────────────────────────────────────── */
const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    text: "Hello Cadet Arjun. I'm your NCC Career Assistant. I can help you find matching jobs, suggest preparation resources, or answer career questions. What would you like to know?",
  },
];

const BOT_REPLIES = [
  "Based on your skills in React and JavaScript, I've highlighted 3 high-match frontend roles in the panel on the right. Would you like guidance on any specific role?",
  "Your NCC C-Certificate and Sergeant rank apply a leadership bonus to roles tagged with team management. Consider highlighting this in your resume.",
  "I've updated the resource panel with courses and videos relevant to your target roles. Systems Design and DSA are the most commonly tested areas.",
  "Your profile completion is at 82%. Adding 2 more projects could improve your match score by around 8%.",
  "For government and defence PSU roles, your NCC background gives you a distinct advantage. Would you like me to filter those specifically?",
  "The preparation resources on the right include both free and paid options. I recommend starting with the DSA playlist before moving to system design.",
];

const MATCHED_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Infosys BPM",
    location: "Bengaluru",
    salary: "6–9 LPA",
    match: 94,
    type: "Full-time",
    url: "https://www.infosys.com/careers/",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Wipro Technologies",
    location: "Hyderabad",
    salary: "7–11 LPA",
    match: 88,
    type: "Full-time",
    url: "https://careers.wipro.com/",
  },
  {
    id: 3,
    title: "Software Engineer",
    company: "CDAC India",
    location: "Pune",
    salary: "5–8 LPA",
    match: 81,
    type: "Government",
    url: "https://www.cdac.in/index.aspx?id=Career",
  },
];

const RESOURCES = [
  {
    id: 1,
    type: "youtube",
    title: "DSA Full Course – Striver",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=rZ41y93P2Qo",
    tag: "Free",
  },
  {
    id: 2,
    type: "course",
    title: "React – The Complete Guide",
    platform: "Udemy",
    url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
    tag: "Paid",
  },
  {
    id: 3,
    type: "course",
    title: "System Design Primer",
    platform: "GitHub",
    url: "https://github.com/donnemartin/system-design-primer",
    tag: "Free",
  },
  {
    id: 4,
    type: "youtube",
    title: "SQL for Beginners – Tech With Tim",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    tag: "Free",
  },
  {
    id: 5,
    type: "website",
    title: "LeetCode – Practice Problems",
    platform: "LeetCode",
    url: "https://leetcode.com/problemset/",
    tag: "Free",
  },
  {
    id: 6,
    type: "course",
    title: "JavaScript Algorithms",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/algorithms-part1",
    tag: "Free audit",
  },
];

/* ─────────────────────────────────────────────
   RESOURCE ICON
───────────────────────────────────────────── */
function ResourceIcon({ type }) {
  if (type === "youtube") return <Youtube className="h-3.5 w-3.5 text-red-500 shrink-0" />;
  if (type === "course")  return <BookOpen className="h-3.5 w-3.5 text-[color:var(--ncc-maroon)] shrink-0" />;
  return <Globe className="h-3.5 w-3.5 text-[color:var(--ncc-army)] shrink-0" />;
}

/* ─────────────────────────────────────────────
   MATCH BADGE
───────────────────────────────────────────── */
function MatchBadge({ pct }) {
  const bg =
    pct >= 90 ? "var(--ncc-army)" :
    pct >= 80 ? "var(--ncc-maroon)" :
    "var(--ncc-gold)";
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
      style={{ background: bg }}
    >
      {pct}%
    </span>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function CareerAssistant() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const replyIndex = useRef(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = BOT_REPLIES[replyIndex.current % BOT_REPLIES.length];
      replyIndex.current += 1;
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: reply }]);
    }, 1000 + Math.random() * 700);
  };

  return (
    <DashboardLayout>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-extrabold">Career Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered job matching and preparation guidance.</p>
      </div>

      {/* Two-column layout — stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row gap-5 lg:h-[calc(100vh-200px)]">

        {/* ── LEFT: Chat interface (wider) ── */}
        <div className="flex-1 min-w-0 card-soft flex flex-col overflow-hidden h-[70vh] lg:h-full">

          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
            <div className="h-8 w-8 rounded-xl hero-gradient grid place-items-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">NCC Career AI</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-7 w-7 rounded-lg hero-gradient grid place-items-center shrink-0 mt-0.5">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "hero-gradient text-white rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="h-7 w-7 rounded-lg hero-gradient grid place-items-center shrink-0">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 shrink-0 border-t border-border">
            <div className="flex gap-2 mt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about jobs, preparation, or career guidance..."
                className="flex-1 h-10 px-4 rounded-xl bg-muted border border-transparent focus:border-border focus:bg-card focus:outline-none text-sm"
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                className="h-10 w-10 rounded-xl hero-gradient grid place-items-center disabled:opacity-40 transition-opacity shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Matched Jobs + Resources ── */}
        <div className="flex flex-col gap-5 w-full lg:w-80 xl:w-96 shrink-0 lg:h-full">

          {/* Matched Jobs — fixed height on mobile, flex fill on desktop */}
          <div className="card-soft flex flex-col overflow-hidden h-52 lg:flex-1 lg:h-auto lg:min-h-0">
            <div className="px-4 py-3 border-b border-border shrink-0">
              <h2 className="font-display font-bold text-sm">Matched Jobs</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Based on your skills and NCC background</p>
            </div>
            <div className="overflow-y-auto divide-y divide-border flex-1">
              {MATCHED_JOBS.map((job) => (
                <a
                  key={job.id}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{job.title}</span>
                      <MatchBadge pct={job.match} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{job.company}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Banknote className="h-3 w-3" />{job.salary}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors mt-0.5 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Preparation Resources — fixed height on mobile, flex fill on desktop */}
          <div className="card-soft flex flex-col overflow-hidden h-64 lg:flex-1 lg:h-auto lg:min-h-0">
            <div className="px-4 py-3 border-b border-border shrink-0">
              <h2 className="font-display font-bold text-sm">Preparation Resources</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Courses, videos, and platforms to get ready</p>
            </div>
            <div className="overflow-y-auto divide-y divide-border flex-1">
              {RESOURCES.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
                >
                  <ResourceIcon type={res.type} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight truncate">{res.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{res.platform}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: res.tag === "Free" || res.tag === "Free audit"
                          ? "color-mix(in oklab, var(--ncc-army) 10%, white)"
                          : "color-mix(in oklab, var(--ncc-gold) 12%, white)",
                        color: res.tag === "Free" || res.tag === "Free audit"
                          ? "var(--ncc-army)"
                          : "color-mix(in oklab, var(--ncc-gold) 70%, black)",
                      }}
                    >
                      {res.tag}
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
