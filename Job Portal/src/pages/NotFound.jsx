import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto h-16 w-16 rounded-2xl hero-gradient grid place-items-center">
          <ShieldAlert className="h-8 w-8 text-white"/>
        </div>
        <h1 className="mt-6 text-7xl font-display font-extrabold">404</h1>
        <h2 className="mt-2 text-xl font-semibold">Mission off-route</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for has been redeployed or never existed.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/" className="btn-primary">Go home</Link>
          <Link to="/jobs" className="btn-outline">Browse jobs</Link>
        </div>
      </div>
    </div>
  );
}
