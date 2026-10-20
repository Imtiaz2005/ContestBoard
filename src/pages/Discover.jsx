
import { useState } from "react";
import contests from "../data/contests";
import { Link } from "react-router-dom";
const categories = [
  "All",
  "Programming",
  "Business",
  "Design",
  "Debate",
  "Sports",
  "Volunteering",
];

function Discover() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("soonest");
  const [location, setLocation] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [organizer, setOrganizer] = useState("");

  // Search, category and filters
  const filteredContests = contests
    .filter((contest) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        contest.title.toLowerCase().includes(query) ||
        contest.organizer.toLowerCase().includes(query) ||
        contest.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        contest.category === selectedCategory;

      const matchesLocation =
        location === "" || contest.location === location;

      const matchesEntryFee =
        entryFee === "" ||
        (entryFee === "free" && contest.isFree) ||
        (entryFee === "paid" && !contest.isFree);

      const matchesOrganizer =
        organizer === "" || contest.organizer === organizer;

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
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime()
        );
      }

      if (sortBy === "latest") {
        return (
          new Date(b.deadline).getTime() -
          new Date(a.deadline).getTime()
        );
      }

      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Hero and search */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Find your next contest
          <span className="text-indigo-700">.</span>
        </h1>

        <p className="mt-2 text-gray-500">
          Hackathons, debates, case competitions and more,
          all in one place.
        </p>

        <div className="mt-5 flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contests or organizers..."
            aria-label="Search contests"
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
              aria-pressed={selectedCategory === category}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCategory === category
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
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          Filter and sort
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by deadline"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="soonest">Closing soon</option>
            <option value="latest">Latest deadline</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Filter by location"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="">All locations</option>
            <option value="Online">Online</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Campus">Campus</option>
          </select>

          <select
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            aria-label="Filter by entry fee"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="">All entry fees</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </select>

          <select
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            aria-label="Filter by organizer"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm"
          >
            <option value="">All organizers</option>
            {[...new Set(contests.map((c) => c.organizer))]
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
            {filteredContests.map((contest) => (
              <article
                key={contest.id}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-28 items-center justify-center rounded-lg bg-indigo-50">
                  <span className="text-sm font-medium text-indigo-400">
                    {contest.category}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-700">
                    Deadline: {contest.deadline}
                  </span>

                  <span
                    className={`rounded-md px-2 py-1 text-xs ${contest.isFree
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                      }`}
                  >
                    {contest.isFree ? "Free" : "Paid"}
                  </span>
                </div>

                <h3 className="mt-3 font-semibold text-gray-900">
                  {contest.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {contest.organizer}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {contest.location}
                </p>

                <Link
                  to={`/contests/${contest.id}`}
                  className="mt-4 block w-full rounded-lg bg-indigo-700 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center">
            <h3 className="font-semibold text-gray-800">
              No contests found
            </h3>
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
                setOrganizer("");
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
