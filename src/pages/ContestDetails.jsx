
import { Link, useParams } from "react-router-dom";
import contests from "../data/contests";

function ContestDetails() {
  const { id } = useParams();

  const contest = contests.find(
    (item) => item.id === Number(id)
  );

  if (!contest) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Contest not found
        </h1>

        <p className="mt-2 text-gray-500">
          This contest may not exist or may have been removed.
        </p>

        <Link
          to="/"
          className="mt-5 inline-block rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white"
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        to="/"
        className="inline-flex text-sm font-medium text-indigo-700 hover:underline"
      >
        ← Back to Discover
      </Link>

      {/* Contest header */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
            {contest.category}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
            {contest.location}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-sm ${
              contest.isFree
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {contest.isFree ? "Free entry" : "Paid entry"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {contest.title}
        </h1>

        <p className="mt-3 text-gray-500">
          Organized by{" "}
          <span className="font-semibold text-gray-800">
            {contest.organizer}
          </span>
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Registration deadline</p>
            <p className="mt-1 font-semibold text-gray-900">
              {contest.deadline}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Eligibility</p>
            <p className="mt-1 font-semibold text-gray-900">
              {contest.eligibility || "See contest guidelines"}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          About this contest
        </h2>

        <p className="mt-3 leading-7 text-gray-600">
          {contest.description ||
            "More information about this contest will be announced by the organizer."}
        </p>
      </section>

      {/* Rules and prizes */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Rules and guidelines
          </h2>

          {contest.rules?.length ? (
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
              {contest.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              Contest rules will be announced soon.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Prize and organizer
          </h2>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Prize information</p>
            <p className="mt-1 font-medium text-gray-900">
              {contest.prize || "To be announced"}
            </p>
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">Organizer type</p>
            <p className="mt-1 font-medium text-gray-900">
              {contest.organizerType || "Organization"}
            </p>
          </div>
        </div>
      </section>

      {/* Registration UI */}
      <section className="rounded-2xl bg-indigo-50 p-5 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Interested in participating?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Review the rules and deadline before registering.
        </p>

        <button
          type="button"
          onClick={() =>
            alert("Registration will be connected to the backend later.")
          }
          className="mt-5 w-full rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white transition hover:bg-indigo-800 sm:w-auto"
        >
          Register for contest
        </button>
      </section>
    </div>
  );
}

export default ContestDetails;
