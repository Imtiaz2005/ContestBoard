import { useState, useEffect } from "react";
import axios from "axios";
import { useSavedContests } from "../context/SavedContext";
import { Link } from "react-router-dom";

const categories = [
  "All", "Programming", "Business", "Design", 
  "Debate", "Sports", "Science", "Robotics", "Other"
];

function Discover() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("soonest");
  const [location, setLocation] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [organizerFilter, setOrganizerFilter] = useState("");
  
  const { savedIds, toggleSaved } = useSavedContests();

  // ১. ডাটাবেজ থেকে অ্যাপ্রুভড কনটেস্টগুলো নিয়ে আসা
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ContestBoard/backend/api/contests/get_all_contests.php"
        );
        if (response.data.success) {
          setContests(response.data.contests);
        }
      } catch (error) {
        console.error("Error fetching discover contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // Search, category and filters
  const filteredContests = contests
    .filter((contest) => {
      const query = search.trim().toLowerCase();
      const isFree = Number(contest.registration_fee) === 0;

      const matchesSearch =
        contest.title.toLowerCase().includes(query) ||
        (contest.organizer && contest.organizer.toLowerCase().includes(query)) ||
        contest.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || contest.category === selectedCategory;

      const matchesLocation =
        location === "" || contest.event_mode === location;

      const matchesEntryFee =
        entryFee === "" ||
        (entryFee === "free" && isFree) ||
        (entryFee === "paid" && !isFree);

      const matchesOrganizer =
        organizerFilter === "" || contest.organizer === organizerFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesEntryFee &&
        matchesOrganizer
      );
    })
    .sort((a, b) => {
      if (sortBy === "soonest") {
        return (
          new Date(a.registration_deadline).getTime() -
          new Date(b.registration_deadline).getTime()
        );
      }
      if (sortBy === "latest") {
        return (
          new Date(b.registration_deadline).getTime() -
          new Date(a.registration_deadline).getTime()
        );
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold text-gray-500">Loading contests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero and search */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Find your next contest
          <span className="text-indigo-700">.</span>
        </h1>
        <p className="mt-2 text-gray-500">
          Hackathons, debates, case competitions and more, all in one place.
        </p>

        <div className="mt-5 flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contests or organizers..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="button"
            onClick={() => setSearch("")}
            className="rounded-lg bg-indigo-700 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-800 sm:px-6"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Category buttons */}
      <section>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "border-indigo-700 bg-indigo-700 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-indigo-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Functional filters */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Filter and sort</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="soonest">Closing soon</option>
            <option value="latest">Latest deadline</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="">All modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="">All entry fees</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </select>

          <select
            value={organizerFilter}
            onChange={(e) => setOrganizerFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="">All organizers</option>
            {[...new Set(contests.map((c) => c.organizer).filter(Boolean))]
              .sort()
              .map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {sortBy === "soonest" ? "Closing soon" : "Latest deadlines"}
          </h2>
          <p className="text-sm text-gray-500">
            {filteredContests.length} contests found
          </p>
        </div>

        {filteredContests.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredContests.map((contest) => {
              const isFree = Number(contest.registration_fee) === 0;
              return (
                <article
                  key={contest.contest_id}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md flex flex-col h-full"
                >
                  <div className="flex h-28 items-center justify-center rounded-lg bg-indigo-50 shrink-0">
                    <span className="text-sm font-medium text-indigo-400">
                      {contest.category}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                      Deadline: {contest.registration_deadline}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        isFree ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isFree ? "Free" : "Paid"}
                    </span>
                  </div>

                  <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
                    {contest.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                    {contest.organizer}
                  </p>
                  <p className="mt-1 mb-4 text-xs text-gray-400 line-clamp-1">
                    {contest.event_mode} {contest.venue && `- ${contest.venue}`}
                  </p>
                  
                  <div className="mt-auto pt-2">
                    <button
                      type="button"
                      onClick={() => toggleSaved(contest.contest_id)}
                      className={`mb-2 w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                        savedIds.includes(contest.contest_id)
                          ? "border-indigo-700 bg-indigo-50 text-indigo-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-indigo-500"
                      }`}
                    >
                      {savedIds.includes(contest.contest_id) ? "♥ Saved" : "♡ Save contest"}
                    </button>
                    <Link
                      to={`/contests/${contest.contest_id}`}
                      className="block w-full rounded-lg bg-indigo-700 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800"
                    >
                      View details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center">
            <h3 className="font-semibold text-gray-800">No contests found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSortBy("soonest");
                setLocation("");
                setEntryFee("");
                setOrganizerFilter("");
              }}
              className="mt-4 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Discover;