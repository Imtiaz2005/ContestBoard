
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ContestResults from "./pages/organizer/ContestResults";
import Discover from "./pages/Discover";
import ContestDetails from "./pages/ContestDetails";
import Saved from "./pages/Saved";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import { SavedProvider } from "./context/SavedContext";
import { ProfileProvider } from "./context/ProfileContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
// import { useAuth } from "../../context/AuthContext";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";

// --- Protected Route Component ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Show a spinner here in real app
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
     // If user is logged in but doesn't have the right role, redirect to their respective dashboard
     if(user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
     if(user.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
     return <Navigate to="/dashboard" replace />; 
  }

  return children;
};
// Organizer pages
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateContest from "./pages/organizer/CreateContest";
import ManageContests from "./pages/organizer/ManageContests";
//import Participants from "./pages/organizer/Participants";
//import Results from "./pages/organizer/Results";
import OrganizerSettings from "./pages/organizer/OrganizerSettings";
import EditContest from "./pages/organizer/EditContest";
//admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContests from "./pages/admin/AdminContests";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
function App() {
  return (
    <AuthProvider> {/* Wrap everything in AuthProvider */}
      <BrowserRouter>
        <SavedProvider>
          <ProfileProvider>
            <Navbar />
            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
              <Routes>
                {/* Public pages */}
                 <Route path="/login" element={<Login />} /> 
               <Route path="/signup" element={<Signup />} /> 
                <Route path="/" element={<Discover />} />
                <Route path="/contests/:id" element={<ContestDetails />} />

                {/* Student Protected pages */}
                <Route path="/saved" element={
                    <ProtectedRoute allowedRoles={['student']}><Saved /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute>
                } />
                <Route path="/portfolio" element={
                    <ProtectedRoute allowedRoles={['student']}><Portfolio /></ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute allowedRoles={['student']}><Settings /></ProtectedRoute>
                } />

                {/* Organizer Protected pages */}
                <Route path="/organizer/dashboard" element={
                    <ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>
                } />
                <Route path="/organizer/create-contest" element={
                    <ProtectedRoute allowedRoles={['organizer']}><CreateContest /></ProtectedRoute>
                } />
                <Route path="/organizer/contests" element={
                    <ProtectedRoute allowedRoles={['organizer']}><ManageContests /></ProtectedRoute>
                } />
                <Route path="/organizer/contests/:id/edit" element={
                    <ProtectedRoute allowedRoles={['organizer']}><EditContest /></ProtectedRoute>
                } />
                <Route path="/organizer/contests/:id/results" element={
                    <ProtectedRoute allowedRoles={['organizer']}><ContestResults /></ProtectedRoute>
                } />
                <Route path="/organizer/settings" element={
                    <ProtectedRoute allowedRoles={['organizer']}><OrganizerSettings /></ProtectedRoute>
                } />

                {/* Admin Protected pages */}
                <Route path="/admin" element={
                     <ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>
                }>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="contests" element={<AdminContests />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="organizations" element={<AdminOrganizations />} />
                  <Route path="announcements" element={<AdminAnnouncements />} />
                </Route>

              </Routes>
            </main>
            <Footer/>
          </ProfileProvider>
        </SavedProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;