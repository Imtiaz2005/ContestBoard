
import { Link } from "react-router-dom";
import contests from "../data/contests";
import { useSavedContests } from "../context/SavedContext";

function Saved() {
  const { savedIds, toggleSaved } = useSavedContests();

  const savedContests = contests.filter((contest) =>
    savedIds.includes(contest.id)
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Saved contests
        </h1>
        <p className="mt-2 text-gray-500">
          Your bookmarked contests in one place.
        </p>
      </div>

      {savedContests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center">
          <h2 className="font-semibold text-gray-800">
            No saved contests yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Browse contests and save the ones you like.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white"
          >
            Discover contests
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedContests.map((contest) => (
            <article
              key={contest.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <span className="text-sm text-indigo-700">
                {contest.category}
              </span>

              <h2 className="mt-2 font-semibold text-gray-900">
                {contest.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {contest.organizer}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Deadline: {contest.deadline}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/contests/${contest.id}`}
                  className="flex-1 rounded-lg bg-indigo-700 px-3 py-2 text-center text-sm font-medium text-white"
                >
                  View details
                </Link>

                <button
                  type="button"
                  onClick={() => toggleSaved(contest.id)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Saved;
