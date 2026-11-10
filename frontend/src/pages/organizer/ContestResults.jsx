import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function ContestResults() {
  const { id } = useParams();

  const [contest, setContest] = useState({ id, title: "Loading..." });
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ name: "", email: "", position: "participated" });
  const [editingId, setEditingId] = useState(null); // এটা এখন registration_id
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // ১. ডাটাবেজ থেকে কনটেস্টের নাম এবং সব পার্টিসিপেন্ট নিয়ে আসা
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `http://localhost/ContestBoard/backend/api/organizer/get_participants.php?contest_id=${id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setContest(response.data.contest);
          setParticipants(response.data.participants);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
        setMessage("Failed to load participants.");
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [id]);

  const filteredParticipants = participants.filter((participant) => {
    const query = search.toLowerCase();
    return (
      participant.name.toLowerCase().includes(query) ||
      participant.email.toLowerCase().includes(query)
    );
  });

  // ২. রেজাল্ট আপডেট করার API কল করা
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId === null) return;

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/api/organizer/update_participant_result.php",
        {
          contest_id: id,
          registration_id: editingId,
          position: form.position
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setParticipants((previous) =>
          previous.map((participant) =>
            participant.registration_id === editingId
              ? { ...participant, position: form.position }
              : participant
          )
        );
        setMessage("Participant result updated successfully.");
        setForm({ name: "", email: "", position: "participated" });
        setEditingId(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(response.data.message || "Failed to update.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("An error occurred while updating.");
    }
  };

  const handleEdit = (participant) => {
    setForm({
      name: participant.name,
      email: participant.email,
      // ডাটাবেজে যদি 'pending' থাকে, তাহলে ডিফল্টভাবে 'participated' দেখাবো
      position: participant.position === "pending" ? "participated" : participant.position,
    });
    setEditingId(participant.registration_id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", position: "participated" });
    setEditingId(null);
    setMessage("");
  };

  const countPosition = (position) =>
    participants.filter((participant) => participant.position === position).length;

  if (loading) {
    return <div className="p-10 text-center text-lg text-slate-500">Loading participants...</div>;
  }

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
            Manage results for <strong>{contest.title}</strong>.
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
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Edit form (Only visible when editing) */}
        {editingId !== null && (
          <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Update Result for {form.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                  <input type="text" value={form.name} disabled className="w-full rounded-lg border border-slate-300 bg-gray-100 px-4 py-3 text-gray-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" value={form.email} disabled className="w-full rounded-lg border border-slate-300 bg-gray-100 px-4 py-3 text-gray-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Result / Position</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full rounded-lg border border-blue-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold"
                  >
                    <option value="participated">Participant (No specific prize)</option>
                    <option value="1st">1st Place</option>
                    <option value="2nd">2nd Place</option>
                    <option value="3rd">3rd Place</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
                  Update Result
                </button>
                <button type="button" onClick={handleCancel} className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {message && !editingId && (
          <p className="mb-4 text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
            {message}
          </p>
        )}

        {/* Participants table */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Registered Participants</h2>
              <p className="mt-1 text-sm text-slate-500">Search and assign results for this contest.</p>
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
                  <th className="px-5 py-4 font-semibold">Participant Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Status / Result</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParticipants.map((participant) => (
                  <tr key={participant.registration_id} className={`hover:bg-slate-50 ${editingId === participant.registration_id ? 'bg-blue-50' : ''}`}>
                    <td className="px-5 py-4 font-medium text-slate-900">{participant.name}</td>
                    <td className="px-5 py-4 text-slate-600">{participant.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          participant.position === "1st" ? "bg-amber-100 text-amber-800"
                          : participant.position === "2nd" ? "bg-slate-200 text-slate-800"
                          : participant.position === "3rd" ? "bg-orange-100 text-orange-800"
                          : participant.position === "participated" ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-500" // pending state
                        }`}
                      >
                        {participant.position === "participated" ? "Participated"
                          : participant.position === "pending" ? "Pending Result"
                          : `${participant.position} Place`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(participant)}
                        className="font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition"
                      >
                        Update Result
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredParticipants.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-10 text-center text-slate-500">
                      No participants registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}