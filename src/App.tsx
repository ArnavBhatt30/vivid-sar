import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Gallery from "./pages/Gallery.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ResearchPage from "./pages/ResearchPage.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import ApiDocsPage from "./pages/ApiDocsPage.tsx";
import MapPage from "./pages/MapPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/docs" element={<ApiDocsPage />} />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/map" element={<MapPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
