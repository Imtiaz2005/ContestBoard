import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference add kora holo
  const navigate = useNavigate();

  const navItems = [
    { name: "Discover", path: "/" },
    { name: "Saved", path: "/saved" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  // Baire click korle jeno dropdown bondho hoye jay tar jonno useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-tight text-indigo-700"
        >
          ContestBoard
        </NavLink>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  ` px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium transition-colors hover:bg-gray-100/50 hover:backdrop-blur-md ${
                    isActive
                      ? "text-indigo-700"
                      : "text-gray-700 hover:text-indigo-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Profile dropdown - ref={dropdownRef} add kora holo ekhane */}
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
                  <p className="font-semibold text-gray-900">Student Name</p>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    student@example.com
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/portfolio");
                  }}
                  className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/saved");
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Saved Contests
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </button>
                <div className="my-2 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;