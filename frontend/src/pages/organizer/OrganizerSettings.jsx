
import { useState } from "react";
import { Link } from "react-router-dom";

const initialProfile = {
  name: "Organizer Name",
  email: "organizer@example.com",
  phone: "",
  photo: "",
  organizationName: "",
  organizationType: "University",
  website: "",
  aboutOrganization: "",
};

export default function OrganizerSettings() {
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend validation.
    // PHP API and database integration will be added later.
    setMessage(
      "Profile validated successfully. Database saving will be connected later."
    );
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/organizer/dashboard"
          className="mb-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Organizer Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Organization Settings
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your account and organization information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal information */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              Your organizer account details.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  className={`${inputClass} cursor-not-allowed bg-slate-100`}
                  readOnly
                />
                <p className="mt-1 text-xs text-slate-500">
                  Email cannot be changed.
                </p>
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className={labelClass}>Profile Photo URL</label>
                <input
                  type="url"
                  name="photo"
                  value={profile.photo}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          </section>

          {/* Organization information */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              Organization Information
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              Details about the organization hosting contests.
            </p>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Organization Name</label>
                <input
                  name="organizationName"
                  value={profile.organizationName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. UIU Robotics Club"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Organization Type</label>
                <select
                  name="organizationType"
                  value={profile.organizationType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="University">University</option>
                  <option value="University Club">University Club</option>
                  <option value="School / College">School / College</option>
                  <option value="Company">Company</option>
                  <option value="Community">Community</option>
                  <option value="Non-profit Organization">
                    Non-profit Organization
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Organization Website</label>
                <input
                  type="url"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://yourorganization.com"
                />
              </div>

              <div>
                <label className={labelClass}>About Organization</label>
                <textarea
                  name="aboutOrganization"
                  value={profile.aboutOrganization}
                  onChange={handleChange}
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Describe your organization, its activities and the contests it organizes..."
                  rows={5}
                />
              </div>
            </div>
          </section>

          {message && (
            <p
              role="status"
              className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
            >
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>

            <Link
              to="/organizer/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          Changes are currently frontend-only and will not persist after a
          refresh. Database integration will be added later.
        </p>
      </div>
    </div>
  );
}
