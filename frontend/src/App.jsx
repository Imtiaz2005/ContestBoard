
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ContestResults from "./pages/organizer/ContestResults";
import Discover from "./pages/Discover";
import ContestDetails from "./pages/ContestDetails";
import Saved from "./pages/Saved";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import { SavedProvider } from "./context/SavedContext";
import { ProfileProvider } from "./context/ProfileContext";

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
    <BrowserRouter>
      <SavedProvider>
        <ProfileProvider>
          <Navbar />

          <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
            <Routes>
              {/* Student and public pages */}
              <Route path="/" element={<Discover />} />
              <Route path="/contests/:id" element={<ContestDetails />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/settings" element={<Settings />} />

              {/* Organizer pages */}
              <Route
                path="/organizer/dashboard"
                element={<OrganizerDashboard />}
              />

              <Route
                path="/organizer/create-contest"
                element={<CreateContest />}
              />
              <Route
                path="/organizer/contests/:id/results"
                element={<ContestResults />}
              />
              <Route
                path="/organizer/contests"
                element={<ManageContests />}
              />
              <Route
                path="/organizer/contests/:id/edit"
                element={<EditContest />}
              />
              {/* <Route
                path="/organizer/participants"
                element={<Participants />}
              /> */}
              <Route
                path="/organizer/settings"
                element={<OrganizerSettings />}
              />
              {/* <Route
                path="/organizer/results"
                element={<Results />}
              /> */}
              {/* Admin pages */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route
                  path="dashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path="contests"
                  element={<AdminContests />}
                />
                <Route
                  path="users"
                  element={<AdminUsers />}
                />
                <Route path="organizations" element={<AdminOrganizations />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
              </Route>

            </Routes>

          </main>
        </ProfileProvider>
      </SavedProvider>
    </BrowserRouter>
  );
}

export default App;
