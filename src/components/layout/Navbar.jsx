
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { name: "Discover", path: "/" },
    { name: "Saved", path: "/saved" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
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
                  `text-sm font-medium transition-colors ${
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

          <button
            type="button"
            aria-label="User profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-semibold text-white"
          >
            RA
          </button>


          
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
