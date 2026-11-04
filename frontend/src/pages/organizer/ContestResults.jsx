
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const initialParticipants = [
  {
    id: 1,
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    position: "1st",
  },
  {
    id: 2,
    name: "Karim Hasan",
    email: "karim@example.com",
    position: "2nd",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    position: "Participant",
  },
];

const emptyForm = {
  name: "",
  email: "",
  position: "Participant",
};

export default function ContestResults() {
  const { id } = useParams();

  const [participants, setParticipants] = useState(initialParticipants);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Temporary contest data; later it will come from the database.
  const contest = {
    id,
    title: `Contest #${id}`,
  };

  const filteredParticipants = participants.filter((participant) => {
    const query = search.toLowerCase();

    return (
      participant.name.toLowerCase().includes(query) ||
      participant.email.toLowerCase().includes(query)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email) {
      setMessage("Name and email are required.");
      return;
    }

    const duplicate = participants.some(
      (participant) =>
        participant.email.toLowerCase() === email &&
        participant.id !== editingId
    );

    if (duplicate) {
      setMessage("This email is already added to this contest.");
      return;
    }

    if (editingId !== null) {
      setParticipants((previous) =>
        previous.map((participant) =>
          participant.id === editingId
            ? { ...participant, name, email, position: form.position }
            : participant
        )
      );

      setMessage("Participant updated successfully.");
    } else {
      setParticipants((previous) => [
        ...previous,
        {
          id: Date.now(),
          name,
          email,
          position: form.position,
        },
      ]);

      setMessage("Participant added successfully.");
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (participant) => {
    setForm({
      name: participant.name,
      email: participant.email,
      position: participant.position,
    });

    setEditingId(participant.id);
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (participantId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this participant?"
    );

    if (!confirmed) return;

    setParticipants((previous) =>
      previous.filter((participant) => participant.id !== participantId)
    );

    if (editingId === participantId) {
      setEditingId(null);
      setForm(emptyForm);
    }

    setMessage("Participant removed.");
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  const countPosition = (position) =>
    participants.filter((participant) => participant.position === position)
      .length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/organizer/contests"
          className="mb-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Manage Contests
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Organizer Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Participants & Results
          </h1>

          <p className="mt-2 text-slate-600">
            Manage participants and assign results for {contest.title}.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Participants", value: participants.length },
            { label: "1st Place", value: countPosition("1st") },
            { label: "2nd Place", value: countPosition("2nd") },
            { label: "3rd Place", value: countPosition("3rd") },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Add/Edit form */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            {editingId !== null ? "Edit Participant" : "Add Participant"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Participant Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter participant name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="participant@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Result / Position
                </label>

                <select
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Participant">Participant</option>
                  <option value="1st">1st Place</option>
                  <option value="2nd">2nd Place</option>
                  <option value="3rd">3rd Place</option>
                </select>
              </div>
            </div>

            {message && (
              <p className="text-sm font-medium text-blue-700" role="status">
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {editingId !== null
                  ? "Update Participant"
                  : "Add Participant"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Participants table */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Participant List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and manage this contest's participants.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 sm:max-w-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Participant</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Position</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {participant.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {participant.email}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          participant.position === "1st"
                            ? "bg-amber-100 text-amber-800"
                            : participant.position === "2nd"
                              ? "bg-slate-200 text-slate-800"
                              : participant.position === "3rd"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {participant.position === "Participant"
                          ? "Participant"
                          : `${participant.position} Place`}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(participant)}
                          className="font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(participant.id)}
                          className="font-semibold text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredParticipants.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No participants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-5 text-sm text-slate-500">
          Note: This page currently uses temporary sample data. Changes will
          reset on refresh until the PHP API and MySQL database are connected.
        </p>
      </div>
    </div>
  );
}
