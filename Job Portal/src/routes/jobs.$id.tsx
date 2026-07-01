import { createFileRoute } from "@tanstack/react-router";
import JobDetails from "../pages/JobDetails";
export const Route = createFileRoute("/jobs/$id")({ component: JobDetails });
