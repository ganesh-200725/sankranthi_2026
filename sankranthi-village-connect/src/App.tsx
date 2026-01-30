import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Games from "./pages/Games";
import Rangoli from "./pages/Rangoli";
import Schedule from "./pages/Schedule";
import Committee from "./pages/Committee";
import Photos from "./pages/Photos";
import Judges from "./pages/Judges";
import Dances from "./pages/Dances";
import NotFound from "./pages/NotFound";

import EditGames from "./pages/EditGames";
import EditSchedule from "./pages/EditSchedule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games" element={<Games />} />
            <Route path="/rangoli" element={<Rangoli />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/committee" element={<Committee />} />
            <Route path="/editgames" element={<EditGames />} />
            <Route path="/editschedule" element={<EditSchedule />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/judges" element={<Judges />} />
            <Route path="/dances" element={<Dances />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
