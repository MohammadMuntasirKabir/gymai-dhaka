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

function App() {
  return (
    <ErrorBoundary>
      <NeonAuthUIProvider authClient={authClient} defaultTheme="dark">
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 pb-14 sm:pb-0">
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
        </AuthProvider>
      </NeonAuthUIProvider>
    </ErrorBoundary>
  );
}

export default App;
