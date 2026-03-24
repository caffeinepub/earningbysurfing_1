import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./contexts/LanguageContext";
import { generateSeedMembers } from "./data/seedMembers";
import { useActor } from "./hooks/useActor";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import VendorPage from "./pages/VendorPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

// ─── Pakistan Block Detection ───────────────────────────────────────────────

const PAKISTAN_TIMEZONES = ["Asia/Karachi"];
const PAKISTAN_LOCALES = ["ur", "ur-PK", "pa-PK"];

function isPakistanBrowser(): boolean {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (PAKISTAN_TIMEZONES.includes(tz)) return true;
  const lang = navigator.language || "";
  if (PAKISTAN_LOCALES.some((l) => lang.startsWith(l))) return true;
  return false;
}

function getCountryCodeFromTimezone(): string | null {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (PAKISTAN_TIMEZONES.includes(tz)) return "PK";
  return null;
}

// ─── Block Screen ────────────────────────────────────────────────────────────

function AccessBlockedScreen() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#FF9933" }}
    >
      <div className="text-center px-8">
        <div className="text-6xl mb-6">🚫</div>
        <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-4">
          Access Restricted
        </h1>
        <p className="text-white/90 text-lg font-medium max-w-md">
          This platform is not available in your region.
        </p>
      </div>
    </div>
  );
}

// ─── Country Gate ─────────────────────────────────────────────────────────────

function CountryGate({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();
  const [blocked, setBlocked] = useState<boolean | null>(null);

  useEffect(() => {
    // Fast browser-level check first
    if (isPakistanBrowser()) {
      setBlocked(true);
      return;
    }

    // If actor is ready, do backend verification
    if (!actor || isFetching) return;

    const countryCode = getCountryCodeFromTimezone();
    if (countryCode) {
      actor
        .checkCountryAccess(countryCode)
        .then((allowed) => {
          setBlocked(!allowed);
        })
        .catch(() => {
          // On error, do not block
          setBlocked(false);
        });
    } else {
      // Also check via backend with a generic lookup attempt
      // For non-PK users, always allow
      setBlocked(false);
    }
  }, [actor, isFetching]);

  // While checking, show nothing (or could show a loading state)
  if (blocked === null) return null;
  if (blocked) return <AccessBlockedScreen />;
  return <>{children}</>;
}

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const vendorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor",
  component: VendorPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute,
  adminRoute,
  vendorRoute,
  aboutRoute,
  contactRoute,
  termsRoute,
  privacyRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("ebs_members")) {
      const members = generateSeedMembers();
      localStorage.setItem("ebs_members", JSON.stringify(members));
      localStorage.setItem("ebs_members_source", "seed");
    }
  }, []);

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <CountryGate>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </CountryGate>
      </QueryClientProvider>
    </LanguageProvider>
  );
}
