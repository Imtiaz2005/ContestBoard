
import { useState } from "react";

const initialContests = [
  {
    id: 1,
    title: "National Programming Contest",
    organizer: "UITS Programming Club",
    category: "Programming",
    status: "pending",
    date: "Oct 25, 2026",
  },
  {
    id: 2,
    title: "Inter-University Robotics Challenge",
    organizer: "UIU Robotics Club",
    category: "Robotics",
    status: "approved",
    date: "Oct 24, 2026",
  },
  {
    id: 3,
    title: "National Web Design Competition",
    organizer: "CSE Society",
    category: "Web Development",
    status: "rejected",
    date: "Oct 23, 2026",
  },
  {
    id: 4,
    title: "University Hackathon 2026",
    organizer: "Tech Innovation Club",
    category: "Hackathon",
    status: "pending",
    date: "Oct 22, 2026",
  },
];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function AdminContests() {
  const [contests, setContests] = useState(initialContests);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const updateStatus = (id, status) => {
    setContests((current) =>
      current.map((contest) =>
        contest.id === id ? { ...contest, status } : contest
      )
    );

    setMessage(`Contest status changed to ${status}.`);
  };

  const removeContest = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this contest?"
    );

    if (!confirmed) return;

    setContests((current) =>
      current.filter((contest) => contest.id !== id)
    );

    setMessage("Contest removed from this demo list.");
  };

  const filteredContests = contests.filter((contest) => {
    const matchesStatus =
      filter === "all" || contest.status === filter;

    const matchesSearch =
      `${contest.title} ${contest.organizer} ${contest.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: contests.length,
    pending: contests.filter((c) => c.status === "pending").length,
    approved: contests.filter((c) => c.status === "approved").length,
    rejected: contests.filter((c) => c.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-indigo-600">
          ADMINISTRATION / CONTESTS
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Contest Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review contest submissions and manage their approval status.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "All Contests", key: "all", color: "text-slate-900" },
          { label: "Pending", key: "pending", color: "text-amber-600" },
          { label: "Approved", key: "approved", color: "text-emerald-600" },
          { label: "Rejected", key: "rejected", color: "text-red-600" },
        ].map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className={`mt-3 text-3xl font-bold ${item.color}`}>
              {counts[item.key]}
            </p>
          </div>
        ))}
      </div>

      {/* Contest list */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Submissions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter and review submitted contests.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contests..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 lg:max-w-xs"
          />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
              <span className="ml-2 opacity-75">
                {counts[item.value]}
              </span>
            </button>
          ))}
        </div>

        {message && (
          <div
            role="status"
            className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700"
          >
            {message}
          </div>
        )}

        {/* Responsive contest cards */}
        <div className="mt-5 space-y-3">
          {filteredContests.map((contest) => (
            <article
              key={contest.id}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {contest.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[contest.status]
                      }`}
                    >
                      {contest.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Organizer: {contest.organizer}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-indigo-700">
                      {contest.category}
                    </span>

                    <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-slate-600">
                      Submitted: {contest.date}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {contest.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(contest.id, "approved")
                      }
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  )}

                  {contest.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(contest.id, "rejected")
                      }
                      className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-200"
                    >
                      Reject
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeContest(contest.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredContests.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-semibold text-slate-700">
                No contests found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing the filter or search term.
              </p>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-slate-400">
          Demo mode: changes are temporary and are not saved to the database.
        </p>
      </section>
    </div>
  );
}
