import { useState, useEffect } from "react";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";

function Portfolio() {
  const { profile } = useProfile();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. পেজ লোড হওয়ার সময় ডাটাবেজ থেকে অ্যাচিভমেন্টস নিয়ে আসা
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ContestBoard/backend/api/students/get_my_achievements.php",
          { withCredentials: true }
        );
        if (response.data.success) {
          setAchievements(response.data.achievements);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const skills = (profile.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="mt-2 text-gray-500">
            Your automatically generated student portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-800"
        >
          Download Portfolio
        </button>
      </div>

      <article
        id="portfolio-document"
        className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-10"
      >
        {/* Header (Profile Info) */}
        <header className="flex flex-col items-center gap-5 border-b border-gray-200 pb-8 text-center sm:flex-row sm:text-left">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name || "Profile"}
              className="h-28 w-28 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-4xl font-bold text-indigo-700">
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-3xl font-bold text-gray-900">
              {profile.name || "Your Name"}
            </h2>
            <p className="mt-2 text-gray-600">
              {profile.department || "Department not added"}
            </p>
            <p className="mt-1 text-gray-500">
              {profile.university || "University not added"}
            </p>

            {profile.email && (
              <p className="mt-3 break-all text-sm text-gray-500">
                {profile.email}
              </p>
            )}

            {profile.phone && (
              <p className="mt-1 text-sm text-gray-500">
                {profile.phone}
              </p>
            )}
          </div>
        </header>

        {/* About Me */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-600">
            {profile.bio || "Add your introduction from Settings."}
          </p>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <div className="mt-3 rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-gray-800">
              {profile.university || "University not added"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {profile.department || "Department not added"}
            </p>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          {skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              Add your skills from Settings.
            </p>
          )}
        </section>

        {/* Contest Achievements */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contest Achievements
          </h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading achievements...</p>
          ) : achievements.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                        {achievement.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {achievement.date_awarded}
                      </span>
                    </div>

                    <h4 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
                      {achievement.contest_name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Organized by {achievement.organizer_name}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                        achievement.position === "1st"
                          ? "bg-amber-100 text-amber-800"
                          : achievement.position === "2nd"
                          ? "bg-gray-200 text-gray-800"
                          : achievement.position === "3rd"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {achievement.position === "participated"
                        ? "Participant"
                        : `${achievement.position} Place`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center">
              <p className="text-sm leading-6 text-gray-500">
                Your verified contest participation, placements and awards will
                appear here automatically when organizers publish the results.
              </p>
            </div>
          )}
        </section>
      </article>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #portfolio-document, #portfolio-document * { visibility: visible; }
          #portfolio-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 20px;
          }
          @page { margin: 12mm; }
        }
      `}</style>
    </section>
  );
}

export default Portfolio;