
import { useProfile } from "../context/ProfileContext";

function Portfolio() {
  const { profile } = useProfile();

  const skills = (profile.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Portfolio
          </h1>
          <p className="mt-2 text-gray-500">
            Your automatically generated student portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-800"
        >
          Download Portfolio
        </button>
      </div>

      <article
        id="portfolio-document"
        className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-10"
      >
        <header className="flex flex-col items-center gap-5 border-b border-gray-200 pb-8 text-center sm:flex-row sm:text-left">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name || "Profile"}
              className="h-28 w-28 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-4xl font-bold text-indigo-700">
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-3xl font-bold text-gray-900">
              {profile.name || "Your Name"}
            </h2>

            <p className="mt-2 text-gray-600">
              {profile.department || "Department not added"}
            </p>

            <p className="mt-1 text-gray-500">
              {profile.university || "University not added"}
            </p>

            {profile.email && (
              <p className="mt-3 break-all text-sm text-gray-500">
                {profile.email}
              </p>
            )}

            {profile.phone && (
              <p className="mt-1 text-sm text-gray-500">
                {profile.phone}
              </p>
            )}
          </div>
        </header>

        <section>
          <h3 className="text-lg font-semibold text-gray-900">
            About Me
          </h3>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-600">
            {profile.bio || "Add your introduction from Settings."}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900">
            Education
          </h3>
          <div className="mt-3 rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-gray-800">
              {profile.university || "University not added"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {profile.department || "Department not added"}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900">
            Skills
          </h3>

          {skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              Add your skills from Settings.
            </p>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900">
            Contest Achievements
          </h3>
          <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-5">
            <p className="text-sm leading-6 text-gray-500">
              Your verified contest participation, placements and
              awards will appear here automatically when organizers
              publish the results.
            </p>
          </div>
        </section>
      </article>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #portfolio-document,
          #portfolio-document * {
            visibility: visible;
          }

          #portfolio-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 20px;
          }

          @page {
            margin: 12mm;
          }
        }
      `}</style>
    </section>
  );
}

export default Portfolio;
