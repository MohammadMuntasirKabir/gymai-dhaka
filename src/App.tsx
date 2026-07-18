import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Gyms from "./pages/Gyms";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import { authClient } from "./lib/auth";
import AuthProvider from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ui/Toast";

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
                  <Routes>
                    <Route index element={<Home />} />
                    <Route path="/auth/:pathname" element={<Auth />} />
                    <Route path="/account/:pathname" element={<Account />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/gyms" element={<Gyms />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
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
