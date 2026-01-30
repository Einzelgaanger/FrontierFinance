
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/ui/loading-screen";
import { useLoadingStore } from "@/store/loading-store";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NetworkWrapper from "./components/NetworkWrapper";
import FundManagerDetail from "./pages/FundManagerDetail";
import Survey from "./pages/Survey";
import Survey2021 from "./pages/Survey2021";
import Survey2022 from "./pages/Survey2022";
import Survey2023 from "./pages/Survey2023";
import Survey2024 from "./pages/Survey2024";
import MyProfile from "./pages/MyProfile";
import ViewerSettings from "./pages/ViewerSettings";
import Application from "./pages/Application";
import Blogs from "./pages/Blogs";
import Community from "./pages/Community";
import BlogDetail from "./pages/BlogDetail";
import LearningResourceDetail from "./pages/LearningResourceDetail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AdminWrapper from "./components/AdminWrapper";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import AdminAnalytics from "./pages/AdminAnalytics";
// Onboarding removed per request
import SurveyResponseViewer from "./components/survey/SurveyResponseViewer";
import NotFound from "./pages/NotFound";
import PortIQ from "./pages/PortIQ";
import LaunchPlusIntro from "./pages/LaunchPlusIntro";
import LaunchPlusAssessment from "./pages/LaunchPlusAssessment";
import AdminLaunchPlusAnalytics from "./pages/AdminLaunchPlusAnalytics";
import DevTasks from "./pages/DevTasks";
import Day1Presentation from "./pages/Day1Presentation";
import Day2Presentation from "./pages/Day2Presentation";
import Drew from "./pages/Drew";
import PlaceholderPage from "./pages/PlaceholderPage";
import { FeedbackButton } from "./components/feedback/FeedbackButton";

const queryClient = new QueryClient();

const App = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading && <LoadingScreen />}
        <Toaster />
        <Sonner />
        <AuthProvider>
        <BrowserRouter>
          <div className="font-rubik">
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/network" element={
              <ProtectedRoute>
                <NetworkWrapper />
              </ProtectedRoute>
            } />
            <Route path="/network/fund-manager/:id" element={
              <ProtectedRoute>
                <FundManagerDetail />
              </ProtectedRoute>
            } />
            <Route path="/survey-response/:userId/:year" element={
              <ProtectedRoute>
                <SurveyResponseViewer />
              </ProtectedRoute>
            } />
            <Route path="/survey" element={
              <ProtectedRoute>
                <Survey />
              </ProtectedRoute>
            } />
            <Route path="/survey/2021" element={
              <ProtectedRoute>
                <Survey2021 />
              </ProtectedRoute>
            } />
            <Route path="/survey/2022" element={
              <ProtectedRoute>
                <Survey2022 />
              </ProtectedRoute>
            } />
            <Route path="/survey/2023" element={
              <ProtectedRoute>
                <Survey2023 />
              </ProtectedRoute>
            } />
            <Route path="/survey/2024" element={
              <ProtectedRoute>
                <Survey2024 />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            } />
            {/* Onboarding route removed */}
            <Route path="/viewer-settings" element={
              <ProtectedRoute requiredRole="viewer">
                <ViewerSettings />
              </ProtectedRoute>
            } />
            <Route path="/application" element={
              <ProtectedRoute requiredRole="viewer">
                <Application />
              </ProtectedRoute>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminWrapper />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/portiq" element={
              <ProtectedRoute>
                <PortIQ />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/blogs" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/blogs/:id" element={
              <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
            } />
            <Route path="/community/learning/:id" element={
              <ProtectedRoute>
                <LearningResourceDetail />
              </ProtectedRoute>
            } />
            <Route path="/launch-plus-intro" element={<LaunchPlusIntro />} />
            <Route path="/launch-plus-assessment" element={<LaunchPlusAssessment />} />
            <Route path="/admin/launch-plus-analytics" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLaunchPlusAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/devtasks" element={<DevTasks />} />
            <Route path="/presentation/day1" element={<Day1Presentation />} />
            <Route path="/presentation/day2" element={<Day2Presentation />} />
            <Route path="/drew" element={<Drew />} />
            <Route path="/about" element={<PlaceholderPage title="About" />} />
            <Route path="/learning-hub" element={<PlaceholderPage title="Learning Hub" />} />
            <Route path="/our-events" element={<PlaceholderPage title="Our Events" />} />
            <Route path="/escp-network" element={<PlaceholderPage title="ESCP Network" />} />
            <Route path="/partnership" element={<PlaceholderPage title="Partnership" />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Floating Feedback Button - appears on all pages */}
          <FeedbackButton />
          </div>
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
