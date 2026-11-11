import { useState, useEffect } from "react";
import axios from "axios";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  suspended: "bg-red-50 text-red-700",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");

  // ১. ডাটাবেজ থেকে সব ইউজারের তথ্য লোড করা
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ContestBoard/backend/api/admin/get_users.php",
          { withCredentials: true }
        );
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ২. ইউজার অ্যাকাউন্ট Suspend বা Activate করা
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/api/admin/update_user_status.php",
        { id, status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers((current) =>
          current.map((user) =>
            user.id === id ? { ...user, status: newStatus } : user
          )
        );
        setMessage(`Account status updated to ${newStatus}.`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // ৩. ডাটাবেজ থেকে ইউজার অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করা
  const removeUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently remove this user account?"
    );

    if (!confirmed) return;

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/api/admin/delete_user.php",
        { id },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers((current) => current.filter((user) => user.id !== id));
        setMessage("Account permanently removed.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to remove user account.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const studentCount = users.filter((user) => user.role === "student").length;
  const organizerCount = users.filter((user) => user.role === "organizer").length;
  const activeCount = users.filter((user) => user.status === "active").length;
  const suspendedCount = users.filter((user) => user.status === "suspended").length;

  if (loading) {
    return <div className="p-10 text-center text-lg text-slate-500">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-indigo-600">
          ADMINISTRATION / USERS
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          User Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage student and organizer accounts on ContestBoard.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Total Users", value: users.length, color: "text-slate-900" },
          { label: "Students", value: studentCount, color: "text-blue-600" },
          { label: "Organizers", value: organizerCount, color: "text-violet-600" },
          { label: "Active Accounts", value: activeCount, color: "text-emerald-600" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className={`mt-3 text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Users section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Accounts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and manage registered users.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 lg:max-w-xs"
          />
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-500">
              ACCOUNT ROLE
            </label>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="organizer">Organizers</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-500">
              ACCOUNT STATUS
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {message && (
          <div
            role="status"
            className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700"
          >
            {message}
          </div>
        )}

        {/* User cards */}
        <div className="mt-5 space-y-3">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-slate-900">
                      {user.name}
                    </h3>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {user.email}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700">
                        {user.role}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusStyles[user.status] || "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {user.status}
                      </span>

                      <span className="text-xs text-slate-400">
                        Joined: {user.joined}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(user.id, user.status)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      user.status === "active"
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {user.status === "active" ? "Suspend" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeUser(user.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-semibold text-slate-700">
                No users found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <span>
            Showing {filteredUsers.length} of {users.length} accounts
          </span>
          <span>
            Suspended accounts: {suspendedCount}
          </span>
        </div>
      </section>
    </div>
  );
}