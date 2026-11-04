
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
const isAdminRoute = window.location.pathname.startsWith("/admin");
  // Temporary role: Login system connect korar por dynamic hobe
  const role = "organizer";
  const isOrganizer = role === "organizer";

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
    // { name: "Participants", path: "/organizer/participants" },
    // { name: "Results & Winners", path: "/organizer/results" },
  ];

  const navItems = isOrganizer
    ? organizerNavItems
    : studentNavItems;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
      isActive
        ? "text-indigo-700"
        : "text-gray-700 hover:text-indigo-700"
    }`;
if (isAdminRoute) {
  return null;
}
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="shrink-0 text-2xl font-bold tracking-tight text-indigo-700"
        >
          ContestBoard
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-label="User profile"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-semibold text-white hover:bg-indigo-800"
            >
              RA
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-3 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                <div className="border-b border-gray-100 px-3 py-3">
                  <p className="font-semibold text-gray-900">
                    {isOrganizer ? "Organizer Name" : "Student Name"}
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {isOrganizer
                      ? "organizer@example.com"
                      : "student@example.com"}
                  </p>

                  <p className="mt-1 text-xs capitalize text-indigo-600">
                    {role}
                  </p>
                </div>

                {isOrganizer ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleNavigate("/organizer/dashboard")
                      }
                      className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleNavigate("/organizer/settings")
                      }
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Organization Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleNavigate("/portfolio")}
                      className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/dashboard")}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/saved")}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Saved Contests
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/settings")}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </button>
                  </>
                )}

                <div className="my-2 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    // Real logout will be connected with PHP session later.
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={linkClass}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
