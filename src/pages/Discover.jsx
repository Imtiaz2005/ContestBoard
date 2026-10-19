
import contests from "../data/contests";

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
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Find your next contest<span className="text-indigo-700">.</span>
        </h1>

        <p className="mt-2 text-gray-500">
          Hackathons, debates, case competitions and more, all in one place.
        </p>

        {/* Search bar - UI only for now */}
        <form
          className="mt-5 flex gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            placeholder="Search contests..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white hover:bg-indigo-800"
          >
            Search
          </button>
        </form>
      </section>

      {/* Categories */}
      <section className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              category === "All"
                ? "border-indigo-700 bg-indigo-700 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-indigo-500"
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Filters - UI only for now */}
      <section className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-medium text-gray-700">Filter:</span>

        <select className="rounded-md border border-gray-300 bg-white px-3 py-2">
          <option value="">Date</option>
          <option value="soonest">Closing soon</option>
          <option value="latest">Latest deadline</option>
        </select>

        <select className="rounded-md border border-gray-300 bg-white px-3 py-2">
          <option value="">Location</option>
          <option value="Online">Online</option>
          <option value="Dhaka">Dhaka</option>
          <option value="Campus">Campus</option>
        </select>

        <select className="rounded-md border border-gray-300 bg-white px-3 py-2">
          <option value="">Entry fee</option>
          <option value="free">Free only</option>
          <option value="paid">Paid</option>
        </select>

        <select className="rounded-md border border-gray-300 bg-white px-3 py-2">
          <option value="">Organizer</option>
          <option value="Tech Club">Tech Club</option>
          <option value="Coding Club">Coding Club</option>
        </select>
      </section>

      {/* Contest cards */}
      <section>
        <h2 className="mb-5 text-xl font-semibold text-gray-900">
          Closing soon
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contests.map((contest) => (
            <article
              key={contest.id}
              className="rounded-xl border border-gray-200 bg-white p-3 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-28 rounded-lg bg-gray-200" />

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-indigo-700 px-2 py-1 text-xs text-white">
                  {contest.deadline}
                </span>

                <span
                  className={`rounded-md px-2 py-1 text-xs ${
                    contest.isFree
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
                {contest.category} · {contest.organizer}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {contest.location}
              </p>

              <button
                type="button"
                className="mt-4 w-full rounded-md bg-indigo-700 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-800"
              >
                View details
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Discover;
