import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Use real auth context
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  // Determine roles based on real user data
  const role = user?.role || null;
  const isOrganizer = role === "organizer";
  const isStudent = role === "student";

  const studentNavItems = [
    { name: "Discover", path: "/" },
    { name: "Saved", path: "/saved" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  const organizerNavItems = [
    { name: "Discover", path: "/" },
    { name: "Dashboard", path: "/organizer/dashboard" },
    { name: "Create Contest", path: "/organizer/create-contest" },
    { name: "Manage Contests", path: "/organizer/contests" },
  ];

  // If not logged in, maybe show a generic nav or login link
  const publicNavItems = [
    { name: "Discover", path: "/" },
    // { name: "Login", path: "/login" }, // You can add these
  ];

  const navItems = isOrganizer
    ? organizerNavItems
    : isStudent
      ? studentNavItems
      : publicNavItems;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login'); // Redirect to login page after logout
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${isActive ? "text-indigo-700" : "text-gray-700 hover:text-indigo-700"
    }`;

  if (isAdminRoute) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="shrink-0 text-2xl font-bold tracking-tight text-indigo-700">
          ContestBoard
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? ( // Only show profile if logged in
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-700 text-sm font-semibold text-white transition hover:bg-indigo-800"
              >
                {profile?.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}</span>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-50 mt-3 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">{user.email}</p>
                    <p className="mt-1 text-xs capitalize text-indigo-600">{role}</p>
                  </div>

                  {isOrganizer && (
                    <>
                      <button onClick={() => handleNavigate("/organizer/dashboard")} className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100">My Dashboard</button>
                      <button onClick={() => handleNavigate("/organizer/settings")} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100">Organization Settings</button>
                    </>
                  )}

                  {isStudent && (
                    <>
                      <button onClick={() => handleNavigate("/portfolio")} className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100">My Profile</button>
                      <button onClick={() => handleNavigate("/dashboard")} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100">My Dashboard</button>
                      <button onClick={() => handleNavigate("/saved")} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100">Saved Contests</button>
                      <button onClick={() => handleNavigate("/settings")} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100">Settings</button>
                    </>
                  )}

                  <div className="my-2 border-t border-gray-100" />
                  <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Show Login button if not logged in
            <button onClick={() => navigate('/login')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Login
            </button>
          )}

          <button onClick={() => setMobileMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 hover:bg-gray-100 lg:hidden">
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
          {/* ... Mobile nav same as desktop logic ... */}
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;