
import { useState } from "react";

function Portfolio() {
  const [profile, setProfile] = useState({
    name: "Student Name",
    university: "Your University",
    department: "Computer Science & Engineering",
    bio: "I enjoy programming, problem-solving, and participating in competitions.",
    skills: "C++, React, Problem Solving",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Portfolio
        </h1>
        <p className="mt-2 text-gray-500">
          Build your student profile and showcase your achievements.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {profile.name || "Your Name"}
            </h2>
            <p className="text-sm text-gray-500">
              Student Profile
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              University
            </label>
            <input
              name="university"
              value={profile.university}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              name="department"
              value={profile.department}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              About Me
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Skills
            </label>
            <input
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="C++, React, UI/UX..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-700 px-5 py-3 font-medium text-white transition hover:bg-indigo-800"
          >
            Save Profile
          </button>
        </form>
      </div>
    </section>
  );
}

export default Portfolio;
