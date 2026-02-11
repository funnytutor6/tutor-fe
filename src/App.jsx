import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import EduLink from "./components/homepage";
import About from "./components/about";
import Header from "./components/header";
import Pricing from "./components/pricing";
import Contact from "./components/contact";
import FindTeachers from "./components/findTeachers";
import Footer from "./components/footer";
import StudentPosts from "./components/studentPosts";
import StudentAuth from "./components/auth/StudentAuth";
import TeacherAuth from "./components/auth/TeacherAuth";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import TutorReviewPage from "./components/reviews/TutorReviewPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import VideoPlayer from "./components/videoPlayer";
import HelpCenter from "./components/helpCenter";
import Success from "./components/stripr/success";
import Cancel from "./components/stripr/cancel";
import PremiumSuccess from "./components/stripr/premiumSucess";
import StudentPremiumSuccess from "./components/stripr/studentPremiumSuccess";
import AdminDashboard from "./components/dashboard/adminDashboard";
import AdminAuth from "./components/auth/adminAuth";
import Subjects from "./components/subjects";
import Resources from "./components/resources";
import TeacherResources from "./components/teacherResources";
import Careers from "./components/careers";
import Blog from "./components/blog";
import Press from "./components/press";
import Privacy from "./components/privacy";
import Terms from "./components/terms";

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={`/login/${requiredRole}`} />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<EduLink />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/find-teachers" element={<FindTeachers />} />
          <Route path="/student-posts" element={<StudentPosts />} />
          <Route path="/login/student" element={<StudentAuth />} />
          <Route path="/login/admin" element={<AdminAuth />} />
          <Route path="/login/teacher" element={<TeacherAuth />} />
          <Route path="/register/student" element={<StudentAuth />} />
          <Route path="/register/teacher" element={<TeacherAuth />} />
          <Route path="/video-demo" element={<VideoPlayer />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/teacher-resources" element={<TeacherResources />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/press" element={<Press />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/success" element={<Success />} />
          <Route
            path="/tutor-review/:teacherId"
            element={<TutorReviewPage />}
          />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/premium-success" element={<PremiumSuccess />} />
          <Route
            path="/student-premium-success"
            element={<StudentPremiumSuccess />}
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/dashboard/teacher"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const AppContent = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
};

export default App;
