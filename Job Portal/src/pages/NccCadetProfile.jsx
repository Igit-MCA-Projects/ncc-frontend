import { motion } from "framer-motion";
import {
  Shield, Award, Star, Activity, Heart, ChevronRight,
  Calendar, Hash, Flag, MapPin, Tent, Trophy, User,
  Ruler, Weight, Droplets, Eye, Ear, FileCheck, AlertCircle,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

/* ─────────────────────────────────────────────
   DUMMY DATA
───────────────────────────────────────────── */
const cadetData = {
  /* ── Personal ──────────── */
  fullName: "Arjun Verma",
  dob: "12 August 2003",
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Arjun",

  /* ── NCC Service ────────── */
  directorate: "Delhi Directorate",
  groupHQ: "Delhi Group HQ",
  battalion: "3 Delhi Battalion NCC",
  unit: "DTU NCC Unit",
  division: "SD",                 // JD / JW / SD / SW
  enrollmentNo: "DL-3D-SD-2022-0047",
  joiningDate: "15 September 2022",
  certificateLevel: "C",          // A / B / C
  certificateNo: "DL/C/2024/1183",
  rank: "Sergeant",
  wing: "Army",

  /* ── Camps & Achievements ── */
  campParticipation: [
    "Annual Training Camp (ATC) – 2023",
    "Combined Annual Training Camp (CATC) – 2022",
    "National Integration Camp (NIC) – 2023",
  ],
  attendance: "92%",
  awards: [
    { label: "Best Cadet Award", year: "2023" },
    { label: "Republic Day Camp (RDC) Certificate", year: "2024" },
    { label: "Thal Sainik Camp (TSC) – SD Grade A", year: "2023" },
  ],
  rdc: true,
  tsc: true,
  nic: true,
  trekking: "Rohtang Pass Trek – 2023",
  mountaineering: "Basic Mountaineering Course, HMI – 2023",
  bestCadet: true,
  otherAchievements: [
    "State Level Shooting Competition – Silver Medal",
    "NCC Day Parade Commander – 2023",
  ],

  /* ── Physical Info ──────── */
  heightCm: 174,
  weightKg: 68,
  bmi: 22.5,
  bloodGroup: "B+",
  chestNormal: 82,     // cm  (male only)
  chestExpanded: 87,   // cm
  running1500m: "5 min 42 sec",
  pushUps: 38,
  sitUps: 45,
  pullUps: 12,
  longJumpM: 4.8,
  highJumpM: 1.35,
  vision: { left: "6/6", right: "6/6" },
  colourBlindness: false,
  hearing: "Normal",

  /* ── Medical Info ───────── */
  fitnessStatus: "Fit",
  spectacles: false,
  lasik: false,
  flatFoot: false,
  knockKnee: false,
  chronicDisease: "None",
  surgeryHistory: "None",
  disability: "None",
  allergies: "Penicillin",
  fitnessCertificate: "Issued – 14 March 2024",
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const bmiLabel = (bmi) => {
  if (bmi < 18.5) return { text: "Underweight", color: "text-blue-500" };
  if (bmi < 25)   return { text: "Normal", color: "text-green-600" };
  if (bmi < 30)   return { text: "Overweight", color: "text-amber-500" };
  return { text: "Obese", color: "text-red-500" };
};

const StatusPill = ({ value }) => {
  const positive = ["Fit", "Normal", "true", true, "Issued", "6/6"];
  const isGood = positive.some((v) =>
    typeof value === "boolean" ? value === v : String(value).startsWith(String(v))
  );
  if (value === false || value === "false" || value === "No" || value === "None") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
        No
      </span>
    );
  }
  if (value === true || value === "true" || value === "Yes" || value === "Fit" || value === "Normal") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
        style={{ background: "var(--ncc-army)" }}
      >
        {typeof value === "boolean" ? "Yes" : value}
      </span>
    );
  }
  return <span className="text-sm font-medium">{String(value)}</span>;
};

function Row({ label, value, highlight }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0 ${highlight ? "bg-muted/30 -mx-5 px-5 rounded-xl" : ""}`}>
      <span className="text-sm text-muted-foreground shrink-0 w-44">{label}</span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}

function Section({ icon: Icon, iconColor, title, children, delay = 0 }) {
  return (
    <motion.div
      className="card-soft p-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
        <div
          className="h-8 w-8 rounded-xl grid place-items-center shrink-0"
          style={{ background: `color-mix(in oklab, ${iconColor} 12%, white)` }}
        >
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
        <h2 className="font-display font-bold text-base">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function NccCadetProfile() {
  const d = cadetData;
  const bmi = bmiLabel(d.bmi);

  return (
    <DashboardLayout>
      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl hero-gradient text-white p-7 sm:p-10 relative overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,39,0.35),transparent_45%)]" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={""}
            alt={d.fullName}
            className="h-20 w-20 rounded-2xl ring-4 ring-white/30 bg-white/10 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-white/70">NCC Cadet Profile</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-display font-extrabold">{d.fullName}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                <Shield className="h-3 w-3" /> {d.wing} Wing
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                <Star className="h-3 w-3" /> {d.rank}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "var(--gradient-gold)", color: "#1a1200" }}
              >
                <Award className="h-3 w-3" /> Certificate {d.certificateLevel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                <Hash className="h-3 w-3" /> {d.enrollmentNo}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 text-right">
            <span className="text-2xl font-display font-extrabold">{d.attendance}</span>
            <span className="text-xs text-white/70">Attendance</span>
          </div>
        </div>
      </motion.div>

      {/* Two-column explicit layout — avoids CSS grid auto-placement gaps */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT column (wider): Service → Awards → Medical ── */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">

          <Section icon={Shield} iconColor="var(--ncc-maroon)" title="NCC Service Details" delay={0.05}>
            <Row label="NCC Directorate" value={d.directorate} />
            <Row label="NCC Group HQ" value={d.groupHQ} />
            <Row label="NCC Battalion" value={d.battalion} />
            <Row label="NCC Unit" value={d.unit} />
            <Row label="Division" value={d.division} />
            <Row label="Enrollment No." value={d.enrollmentNo} />
            <Row label="Joining Date" value={d.joiningDate} />
            <Row label="Date of Birth" value={d.dob} />
            <Row label="Certificate Level" value={`${d.certificateLevel}-Certificate`} />
            <Row label="Certificate Number" value={d.certificateNo} />
            <Row label="Rank" value={d.rank} />
            <Row label="Wing" value={d.wing} />
          </Section>

          <Section icon={Trophy} iconColor="var(--ncc-gold)" title="Awards & Achievements" delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {d.awards.map((a) => (
                <div
                  key={a.label}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: "color-mix(in oklab, var(--ncc-gold) 8%, white)" }}
                >
                  <Award className="h-4 w-4 text-[color:var(--ncc-gold)] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.year}</div>
                  </div>
                </div>
              ))}
            </div>
            <Row label="Best Cadet Award" value={d.bestCadet ? "Awarded ✓" : "Not awarded"} />
            <Row label="Trekking" value={d.trekking} />
            <Row label="Mountaineering" value={d.mountaineering} />
            <div className="mt-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Other Achievements</p>
              <ul className="space-y-1.5">
                {d.otherAchievements.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm bg-muted/60 rounded-xl px-3 py-2">
                    <ChevronRight className="h-3.5 w-3.5 text-[color:var(--ncc-maroon)] mt-0.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section icon={Heart} iconColor="#e11d48" title="Medical Information" delay={0.14}>
            <div
              className="rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background: d.fitnessStatus === "Fit" ? "color-mix(in oklab, var(--ncc-army) 10%, white)" : "color-mix(in oklab, #e11d48 10%, white)" }}
            >
              <FileCheck className="h-5 w-5 shrink-0" style={{ color: d.fitnessStatus === "Fit" ? "var(--ncc-army)" : "#e11d48" }} />
              <div className="flex-1">
                <div className="font-semibold text-sm">Fitness Status: {d.fitnessStatus}</div>
                <div className="text-xs text-muted-foreground">Certificate: {d.fitnessCertificate}</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <div>
                <Row label="Spectacles" value={d.spectacles ? "Yes" : "No"} />
                <Row label="LASIK" value={d.lasik ? "Yes" : "No"} />
                <Row label="Flat Foot" value={d.flatFoot ? "Yes" : "No"} />
                <Row label="Knock Knee" value={d.knockKnee ? "Yes" : "No"} />
              </div>
              <div>
                <Row label="Chronic Disease" value={d.chronicDisease} />
                <Row label="Surgery History" value={d.surgeryHistory} />
                <Row label="Disability" value={d.disability} />
                <Row label="Allergies" value={d.allergies} />
              </div>
            </div>
          </Section>

        </div>

        {/* ── RIGHT column (narrower): Camps → Physical ── */}
        <div className="flex flex-col gap-6 w-full lg:w-80 xl:w-96 shrink-0">

          <Section icon={Tent} iconColor="var(--ncc-army)" title="Camps & Attendance" delay={0.08}>
            <Row label="Attendance" value={d.attendance} />
            <Row label="RDC" value={d.rdc ? "Participated" : "Not participated"} />
            <Row label="TSC" value={d.tsc ? "Participated" : "Not participated"} />
            <Row label="NIC" value={d.nic ? "Participated" : "Not participated"} />
            <div className="mt-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Camp Participation</p>
              <ul className="space-y-1.5">
                {d.campParticipation.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm bg-muted/60 rounded-xl px-3 py-2">
                    <Flag className="h-3.5 w-3.5 text-[color:var(--ncc-army)] mt-0.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section icon={Activity} iconColor="var(--ncc-army)" title="Physical Information" delay={0.12}>
            <div
              className="rounded-2xl p-4 mb-4 flex items-center gap-4"
              style={{ background: "color-mix(in oklab, var(--ncc-maroon) 6%, white)", border: "1px solid color-mix(in oklab, var(--ncc-maroon) 15%, white)" }}
            >
              <div className="flex-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">BMI</div>
                <div className="text-3xl font-display font-extrabold">{d.bmi}</div>
                <div className={`text-xs font-semibold mt-0.5 ${bmi.color}`}>{bmi.text}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs text-muted-foreground">Height</div>
                <div className="font-semibold text-sm">{d.heightCm} cm</div>
                <div className="text-xs text-muted-foreground mt-1">Weight</div>
                <div className="font-semibold text-sm">{d.weightKg} kg</div>
              </div>
            </div>
            <Row label="Blood Group" value={d.bloodGroup} />
            <Row label="Chest (Normal)" value={`${d.chestNormal} cm`} />
            <Row label="Chest (Expanded)" value={`${d.chestExpanded} cm`} />
            <Row label="1500m Running" value={d.running1500m} />
            <Row label="Push-ups" value={`${d.pushUps} reps`} />
            <Row label="Sit-ups" value={`${d.sitUps} reps`} />
            <Row label="Pull-ups" value={`${d.pullUps} reps`} />
            <Row label="Long Jump" value={`${d.longJumpM} m`} />
            <Row label="High Jump" value={`${d.highJumpM} m`} />
            <Row label="Vision (L / R)" value={`${d.vision.left} / ${d.vision.right}`} />
            <Row label="Colour Blindness" value={d.colourBlindness ? "Yes" : "No"} />
            <Row label="Hearing" value={d.hearing} />
          </Section>

        </div>
      </div>
    </DashboardLayout>
  );
}
