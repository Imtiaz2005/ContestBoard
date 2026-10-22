
import { useState } from "react";
import { useProfile } from "../context/ProfileContext";

function Settings() {
  const { profile, updateProfile } = useProfile();
  const [message, setMessage] = useState("");

  const isOrganizer = profile.role === "organizer";

  function handleChange(event) {
    const { name, value } = event.target;
    updateProfile({ [name]: value });
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("Profile information saved successfully!");
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="mt-2 text-gray-500">
          Manage your profile and account information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isOrganizer
              ? "Manage your organizer account details."
              : "Manage your student profile details."}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email || ""}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Email cannot be changed from Settings.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Profile Picture URL
          </label>
          <input
            type="url"
            name="photo"
            value={profile.photo || ""}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
          <p className="mt-1 text-xs text-gray-500">
            Photo upload will be connected to the backend later.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
        </div>

        {isOrganizer ? (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Organization / Club Name
              </label>
              <input
                name="organizationName"
                value={profile.organizationName || ""}
                onChange={handleChange}
                placeholder="e.g. University Robotics Club"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Organization Type
              </label>
              <select
                name="organizationType"
                value={profile.organizationType || "club"}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-600"
              >
                <option value="individual">Individual</option>
                <option value="university">University</option>
                <option value="club">Club / Society</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Position / Designation
              </label>
              <input
                name="designation"
                value={profile.designation || ""}
                onChange={handleChange}
                placeholder="e.g. Club President"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Website / Social Link
              </label>
              <input
                type="url"
                name="website"
                value={profile.website || ""}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                University
              </label>
              <input
                name="university"
                value={profile.university || ""}
                onChange={handleChange}
                placeholder="Your university"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                name="department"
                value={profile.department || ""}
                onChange={handleChange}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Skills
              </label>
              <input
                name="skills"
                value={profile.skills || ""}
                onChange={handleChange}
                placeholder="C++, React, Problem Solving"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>
          </>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            About
          </label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            rows={4}
            placeholder="Write a short introduction..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-700 px-5 py-3 font-medium text-white hover:bg-indigo-800"
        >
          Save Changes
        </button>

        {message && (
          <p role="status" className="text-sm text-green-700">
            {message}
          </p>
        )}
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Password & Security
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Password change will be enabled after secure backend
          authentication is implemented.
        </p>
      </div>
    </section>
  );
}

export default Settings;
