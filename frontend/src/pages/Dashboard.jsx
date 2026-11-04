
import { useProfile } from "../context/ProfileContext";

function Dashboard() {
  const { profile } = useProfile();

  const stats = [
    { label: "Participated", value: 0 },
    { label: "Contests Won", value: 0 },
    { label: "Runner-up", value: 0 },
    { label: "Upcoming", value: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>
        <p className="mt-2 text-gray-500">
          Manage your profile and track your contest journey.
        </p>
      </div>

      {/* Profile Overview */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name || "Profile"}
              className="h-24 w-24 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.name || "Student Name"}
            </h2>

            <p className="mt-1 text-gray-600">
              {profile.department || "Department not added"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {profile.university || "University not added"}
            </p>

            <p className="mt-3 text-sm text-gray-600">
              {profile.bio || "Add a short introduction in Settings."}
            </p>
          </div>

          <a
            href="/settings"
            className="inline-flex shrink-0 items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit Profile
          </a>
        </div>

        {profile.skills && (
          <div className="mt-6 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-800">
              Skills
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Contest Statistics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your contest progress at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <p className="text-sm font-medium text-gray-500">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Participation History */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Participation History
        </h2>

        <div className="py-10 text-center">
          <p className="font-medium text-gray-700">
            No contest participation yet
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Contests you join will appear here.
          </p>

          <a
            href="/"
            className="mt-5 inline-flex rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-800"
          >
            Explore Contests
          </a>
        </div>
      </section>

      {/* Achievements */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Achievements
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your verified awards and contest placements will appear here
          when organizers publish the results.
        </p>
      </section>
      
{/* Quick Actions */}
<section>
  <h2 className="mb-4 text-xl font-bold text-gray-900">
    Quick Actions
  </h2>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <a
      href="/portfolio"
      className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
    >
      <h3 className="font-semibold text-gray-900">
        View Portfolio
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        View or download your professional portfolio.
      </p>
    </a>

    <a
      href="/saved"
      className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
    >
      <h3 className="font-semibold text-gray-900">
        Saved Contests
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Find the contests you saved earlier.
      </p>
    </a>

    <a
      href="/settings"
      className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
    >
      <h3 className="font-semibold text-gray-900">
        Profile Settings
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Update your personal information and skills.
      </p>
    </a>
  </div>
</section>

    </div>
  );
}

export default Dashboard;
