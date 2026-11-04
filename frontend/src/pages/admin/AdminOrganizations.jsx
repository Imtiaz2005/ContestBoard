import { useState } from "react";

const initialOrganizations = [
  {
    id: 1,
    name: "UIU Robotics Club",
    email: "robotics@uiu.ac.bd",
    type: "University Club",
    website: "https://uiu.ac.bd",
    status: "active",
  },
  {
    id: 2,
    name: "UITS Programming Club",
    email: "programming@uits.edu.bd",
    type: "University Club",
    website: "https://uits.edu.bd",
    status: "active",
  },
  {
    id: 3,
    name: "TechFest Bangladesh",
    email: "info@techfest.com",
    type: "Event Organization",
    website: "https://example.com",
    status: "blocked",
  },
];

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const toggleStatus = (id) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === id
          ? {
              ...org,
              status: org.status === "active" ? "blocked" : "active",
            }
          : org
      )
    );
  };

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || org.status === filter;

    return matchesSearch && matchesFilter;
  });

  const activeCount = organizations.filter(
    (org) => org.status === "active"
  ).length;

  const blockedCount = organizations.filter(
    (org) => org.status === "blocked"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Organization Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage registered organizations and their contest posting access.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Organizations</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeCount}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Blocked Organizations</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {blockedCount}
          </h2>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search organization name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Organizations</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Organization List */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            Registered Organizations
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">
                      {org.name}
                    </p>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {org.email}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {org.type}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        org.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {org.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStatus(org.id)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium text-white ${
                        org.status === "active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {org.status === "active"
                        ? "Block Posting"
                        : "Unblock Posting"}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrganizations.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Note: Blocking an organization prevents future contest posting.
        It does not suspend the organization's account.
      </p>
    </div>
  );
}