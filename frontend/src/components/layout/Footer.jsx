import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // অ্যাডমিন প্যানেলে ফুটার দেখানোর দরকার নেই
  const isAdminRoute = location.pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <footer className="mt-auto bg-slate-700 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white">
              Contest<span className="text-indigo-400">Board</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Your ultimate platform to discover, participate, and manage hackathons, case competitions, and technical events in Bangladesh.
            </p>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              For Students
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-sm transition-colors hover:text-white">
                  Discover Contests
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm transition-colors hover:text-white">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm transition-colors hover:text-white">
                  My Portfolio
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-sm transition-colors hover:text-white">
                  Saved Contests
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              For Organizers
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/organizer/dashboard" className="text-sm transition-colors hover:text-white">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/organizer/create-contest" className="text-sm transition-colors hover:text-white">
                  Post a Contest
                </Link>
              </li>
              <li>
                <Link to="/organizer/contests" className="text-sm transition-colors hover:text-white">
                  Manage Contests
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm transition-colors hover:text-white">
                  Help Center / FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm transition-colors hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm transition-colors hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {currentYear} ContestBoard. All rights reserved.
          </p>
          
          {/* Social Icons Placeholder */}
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 transition-colors hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="text-slate-400 transition-colors hover:text-white">
              <span className="sr-only">Twitter / X</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;