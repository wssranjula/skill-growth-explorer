
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SkillsAnalysis from "./pages/SkillsAnalysis";
import LearningPlan from "./pages/LearningPlan";
import Resources from "./pages/Resources";
import MicroLesson from "./pages/MicroLesson";
import TrendingContent from "./pages/TrendingContent";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="skills" element={<SkillsAnalysis />} />
            <Route path="learning-plan" element={<LearningPlan />} />
            <Route path="resources" element={<Resources />} />
            <Route path="micro-lesson/:id" element={<MicroLesson />} />
            <Route path="trending" element={<TrendingContent />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
