import { createFileRoute } from "@tanstack/react-router";
import SavedJobs from "../pages/SavedJobs";
export const Route = createFileRoute("/saved-jobs")({ component: SavedJobs });
