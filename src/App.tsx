import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import { authClient } from "./lib/auth";
import AuthProvider from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ui/Toast";

// Route-level code splitting keeps the initial bundle small; heavy pages
// (auth UI, account/onboarding forms, profile, gym finder) load on demand.
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Profile = lazy(() => import("./pages/Profile"));
const Gyms = lazy(() => import("./pages/Gyms"));

function RouteFallback() {
  return (
    <div
      className="flex items-center justify-center py-24"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin"
        aria-label="Loading"
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <NeonAuthUIProvider authClient={authClient} defaultTheme="dark">
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-black focus:font-medium"
              >
                Skip to content
              </a>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main id="main-content" className="flex-1 pb-14 sm:pb-0">
                  <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      <Route index element={<Home />} />
                      <Route path="/auth/:pathname" element={<Auth />} />
                      <Route path="/account/:pathname" element={<Account />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/gyms" element={<Gyms />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <MobileBottomNav />
              </div>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </NeonAuthUIProvider>
    </ErrorBoundary>
  );
}

export default App;
