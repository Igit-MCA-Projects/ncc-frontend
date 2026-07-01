import { motion } from "framer-motion";

export default function ProfileCompletionCard({ percent = 70, onEdit }) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Profile completion</p>
          <h3 className="text-2xl font-display font-extrabold">{percent}%</h3>
        </div>
        <button onClick={onEdit} className="btn-outline text-sm">Complete</button>
      </div>
      <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full hero-gradient"
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Add projects and NCC rank details to unlock higher-match jobs.
      </p>
    </div>
  );
}
