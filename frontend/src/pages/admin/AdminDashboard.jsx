import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";

const activities = [
  {
    title: "Platform Monitor",
    detail: "System is running smoothly.",
    time: "Just now",
    icon: "🟢",
  },
  {
    title: "Contest Review",
    detail: "Check the pending tab for new submissions.",
    time: "Ongoing",
    icon: "📋",
  },
  {
    title: "Platform announcement",
    detail: "Update users via the announcement section.",
    time: "Recently",
    icon: "📢",
  },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

export default function AdminDashboard() {
  const { profile } = useProfile();
  
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    total_contests: 0,
    pending_contests: 0,
    active_organizers: 0
  });
  const [pendingContests, setPendingContests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ContestBoard/backend/api/admin/get_dashboard_data.php",
          { withCredentials: true }
        );
        if (response.data.success) {
          setDashboardStats(response.data.stats);
          setPendingContests(response.data.pendingContests);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: dashboardStats.total_users,
      subtitle: "Registered students & organizers",
      icon: "👥",
      color: "blue",
    },
    {
      title: "Total Contests",
      value: dashboardStats.total_contests,
      subtitle: "All published and submitted contests",
      icon: "🏆",
      color: "violet",
    },
    {
      title: "Pending Approvals",
      value: dashboardStats.pending_contests,
      subtitle: "Contests waiting for review",
      icon: "⏳",
      color: "amber",
    },
    {
      title: "Active Organizers",
      value: dashboardStats.active_organizers,
      subtitle: "Organizations on ContestBoard",
      icon: "🏢",
      color: "emerald",
    },
  ];

  const filteredContests = pendingContests.filter((contest) =>
    `${contest.title} ${contest.organizer} ${contest.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              CONTESTBOARD / ADMIN
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor your platform and manage contest activities.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {(profile.name || "A").charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {profile.name || "Administrator"}
              </p>
              <p className="text-xs text-slate-500">Platform management</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Platform Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick overview of ContestBoard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                      colorClasses[stat.color]
                    }`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <h3 className="mt-5 text-3xl font-bold text-slate-900">
                  {loading ? "..." : stat.value}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Pending Contests */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Pending Contests
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review contests submitted by organizers.
                </p>
              </div>

              <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {filteredContests.length} pending
              </span>
            </div>

            <div className="mt-5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contests or organizers..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="py-10 text-center text-sm text-slate-500">Loading pending contests...</div>
              ) : filteredContests.map((contest) => (
                <div
                  key={contest.title}
                  className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-800">
                        {contest.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {contest.organizer}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                          {contest.category}
                        </span>

                        <span className="text-xs text-slate-400">
                          Submitted: {contest.date}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/admin/contests"
                      className="w-fit shrink-0 rounded-lg bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}

              {!loading && filteredContests.length === 0 && (
                <div className="rounded-xl bg-slate-50 px-4 py-10 text-center">
                  <p className="font-medium text-emerald-600">
                    All caught up!
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    There are no pending contests right now.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest platform events.
            </p>

            <div className="mt-6 space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                    {activity.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {activity.detail}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {activity.time}
                    </p>

                    {index !== activities.length - 1 && (
                      <div className="mt-5 border-b border-slate-100" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">Manage ContestBoard</h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
            Keep contests organized, review submissions, manage users, and
            communicate important updates to the community.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/admin/contests" className="rounded-lg bg-white/20 hover:bg-white/30 transition px-4 py-2.5 text-sm font-medium">
              Contest Review
            </Link>

            <Link to="/admin/users" className="rounded-lg bg-white/20 hover:bg-white/30 transition px-4 py-2.5 text-sm font-medium">
              User Management
            </Link>

            <Link to="/admin/organizations" className="rounded-lg bg-white/20 hover:bg-white/30 transition px-4 py-2.5 text-sm font-medium">
              Organizations
            </Link>
          </div>
        </section>

        <p className="pb-2 text-center text-xs text-slate-400">
          ContestBoard Admin Panel · Powered by React & PHP
        </p>
      </div>
    </div>
  );
}