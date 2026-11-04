import { useState } from "react";

const initialAnnouncements = [
  {
    id: 1,
    title: "Welcome to ContestBoard",
    message: "Discover upcoming programming contests and events.",
    active: true,
  },
  {
    id: 2,
    title: "Scheduled Maintenance",
    message: "ContestBoard may be temporarily unavailable on Friday.",
    active: false,
  },
];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) return;

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title, message }
            : item
        )
      );
      setEditingId(null);
    } else {
      setAnnouncements((prev) => [
        {
          id: Date.now(),
          title,
          message,
          active: false,
        },
        ...prev,
      ]);
    }

    setTitle("");
    setMessage("");
  };

  const editAnnouncement = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setMessage(item.message);
  };

  const deleteAnnouncement = (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setAnnouncements((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setMessage("");
    }
  };

  const toggleAnnouncement = (id) => {
    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, active: !item.active }
          : { ...item, active: false }
      )
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setMessage("");
  };

  const activeAnnouncement = announcements.find(
    (item) => item.active
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Announcement Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage announcements displayed on the website.
        </p>
      </div>

      {/* Active Announcement Preview */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Website Announcement Preview
        </p>

        {activeAnnouncement ? (
          <>
            <h3 className="font-bold text-blue-900">
              {activeAnnouncement.title}
            </h3>
            <p className="mt-1 text-sm text-blue-800">
              {activeAnnouncement.message}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            No active announcement at the moment.
          </p>
        )}
      </div>

      {/* Create / Edit Form */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-800">
          {editingId ? "Edit Announcement" : "Create New Announcement"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Announcement Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Announcement Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your announcement..."
              rows="3"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {editingId ? "Update Announcement" : "Create Announcement"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Announcement List */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            All Announcements ({announcements.length})
          </h2>
        </div>

        <div className="divide-y">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {item.message}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  onClick={() => toggleAnnouncement(item.id)}
                  className="rounded-lg border px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  {item.active ? "Deactivate" : "Publish"}
                </button>

                <button
                  onClick={() => editAnnouncement(item)}
                  className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAnnouncement(item.id)}
                  className="rounded-lg border px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <p className="p-8 text-center text-sm text-gray-500">
              No announcements created yet.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Only one announcement can be active at a time.
      </p>
    </div>
  );
}