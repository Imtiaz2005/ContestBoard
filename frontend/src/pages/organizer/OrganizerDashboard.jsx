
import { Link } from "react-router-dom";

const OrganizerDashboard = () => {
  // Temporary sample data.
  // Later, these values will come from the database.
  const organizer = {
    name: "Organizer Name",
    organizationName: "Organization Name",
    email: "organizer@example.com",
    mobile: "01XXXXXXXXX",
    photo: "",
  };

  const stats = [
    {
      title: "Total Contests",
      value: 0,
      icon: "📋",
      color: "bg-indigo-50 text-indigo-700",
      description: "All your contests",
    },
    {
      title: "Approved Contests",
      value: 0,
      icon: "✅",
      color: "bg-green-50 text-green-700",
      description: "Approved by admin",
    },
    {
      title: "Pending Contests",
      value: 0,
      icon: "⏳",
      color: "bg-amber-50 text-amber-700",
      description: "Waiting for approval",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-indigo-600">
          ORGANIZER PANEL
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your contests and keep track of their approval status.
        </p>
      </div>

      {/* Organizer profile */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-2 bg-indigo-600" />

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          {/* Profile picture */}
          {organizer.photo ? (
            <img
              src={organizer.photo}
              alt={organizer.name}
              className="h-24 w-24 rounded-full border-4 border-indigo-50 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
              {organizer.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          {/* Organizer information */}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {organizer.name}
            </h2>

            <p className="mt-1 font-medium text-indigo-700">
              {organizer.organizationName}
            </p>

            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <p className="flex items-center gap-2 break-all">
                <span aria-hidden="true">✉</span>
                {organizer.email}
              </p>

              <p className="flex items-center gap-2">
                <span aria-hidden="true">☎</span>
                {organizer.mobile}
              </p>
            </div>
          </div>

          <Link
            to="/settings"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Edit Profile
          </Link>
        </div>
      </section>

      {/* Contest statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Contest Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A summary of your contest activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Quickly access your contest management tools.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/organizer/create-contest"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <span aria-hidden="true">＋</span>
            Create Contest
          </Link>

          <Link
            to="/organizer/contests"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Manage Contests
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OrganizerDashboard;
