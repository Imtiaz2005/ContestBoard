
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const sampleContests = [
  {
    contest_id: 1,
    title: "Inter-University Hackathon",
    category: "Programming",
    event_mode: "Offline",
    contest_start: "2026-12-12",
    registration_deadline: "2026-12-05",
    status: "approved",
  },
  {
    contest_id: 2,
    title: "Robotics Challenge",
    category: "Robotics",
    event_mode: "Hybrid",
    contest_start: "2026-12-20",
    registration_deadline: "2026-12-12",
    status: "pending",
  },
  {
    contest_id: 3,
    title: "Business Case Competition",
    category: "Business",
    event_mode: "Online",
    contest_start: "2027-01-10",
    registration_deadline: "2027-01-03",
    status: "rejected",
  },
];

const statusStyles = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const formatDate = (date) => {
  if (!date) return "Not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ManageContests = () => {
  const [contests, setContests] = useState(sampleContests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const matchesSearch =
        contest.title.toLowerCase().includes(search.toLowerCase()) ||
        contest.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || contest.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contests, search, statusFilter]);

  const counts = {
    all: contests.length,
    approved: contests.filter((c) => c.status === "approved").length,
    pending: contests.filter((c) => c.status === "pending").length,
    rejected: contests.filter((c) => c.status === "rejected").length,
  };

  // Temporary UI action. Real API update will be added later.
  const handleDelete = (contestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this sample contest from the page?"
    );

    if (!confirmed) return;

    setContests((current) =>
      current.filter((contest) => contest.contest_id !== contestId)
    );
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            ORGANIZER PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Manage Contests
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage the contests you have created.
          </p>
        </div>

        <Link
          to="/organizer/create-contest"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          + Create Contest
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Contests", value: counts.all },
          { label: "Approved", value: counts.approved },
          { label: "Pending", value: counts.pending },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by contest title or category..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
        >
          <option value="all">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Contest list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-bold text-gray-900">Your Contests</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredContests.length} contest(s) found
          </p>
        </div>

        {filteredContests.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="text-4xl">📋</div>
            <h3 className="mt-3 font-semibold text-gray-900">
              No contests found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredContests.map((contest) => (
              <div
                key={contest.contest_id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {contest.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        statusStyles[contest.status]
                      }`}
                    >
                      {contest.status}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>{contest.category}</span>
                    <span>{contest.event_mode}</span>
                    <span>
                      Contest: {formatDate(contest.contest_start)}
                    </span>
                    <span>
                      Deadline: {formatDate(contest.registration_deadline)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
  to={`/organizer/contests/${contest.contest_id}/results`}
  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
>
  Manage Participants & Results
</Link>
                  <Link
                    to={`/organizer/contests/${contest.contest_id}/edit`}
                    className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(contest.contest_id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContests;
