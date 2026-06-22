import { AuthView } from "@neondatabase/neon-js/auth/react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Auth() {
  const { pathname } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give the AuthView a moment to hydrate, then show content
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <Loader2 className="w-10 h-10 text-accent mx-auto mb-4 animate-spin" />
          <p className="text-muted">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <AuthView pathname={pathname} />
      </div>
    </div>
  );
}
