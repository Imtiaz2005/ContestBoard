import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";

function Dashboard() {
  const { profile } = useProfile();
  
  const [statsData, setStatsData] = useState({
    participated: 0, won: 0, runner_up: 0, upcoming: 0
  });
  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটাবেজ থেকে স্ট্যাটস, হিস্ট্রি এবং অ্যাচিভমেন্টস আনা
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ১. স্ট্যাটস এবং রিসেন্ট হিস্ট্রি আনা
        const statsResponse = await axios.get(
          "http://localhost/ContestBoard/backend/api/students/get_dashboard_stats.php",
          { withCredentials: true }
        );
        if (statsResponse.data.success) {
          setStatsData(statsResponse.data.stats);
          setHistory(statsResponse.data.history);
        }

        // ২. অ্যাচিভমেন্টস (যাদের রেজাল্ট pending নয়) আনা
        const achvResponse = await axios.get(
          "http://localhost/ContestBoard/backend/api/students/get_my_achievements.php",
          { withCredentials: true }
        );
        if (achvResponse.data.success) {
          setAchievements(achvResponse.data.achievements);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Participated", value: statsData.participated },
    { label: "Contests Won", value: statsData.won },
    { label: "Runner-up", value: statsData.runner_up },
    { label: "Upcoming", value: statsData.upcoming },
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-500">Manage your profile and track your contest journey.</p>
      </div>

      {/* Profile Overview */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name || "Profile"}
              className="h-24 w-24 rounded-full border border-gray-200 object-cover shrink-0"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name || "Student Name"}</h2>
            <p className="mt-1 text-gray-600">{profile.department || "Department not added"}</p>
            <p className="mt-1 text-sm text-gray-500">{profile.university || "University not added"}</p>
            <p className="mt-3 text-sm text-gray-600">{profile.bio || "Add a short introduction in Settings."}</p>
          </div>

          <Link
            to="/settings"
            className="inline-flex shrink-0 items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit Profile
          </Link>
        </div>

        {profile.skills && (
          <div className="mt-6 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-800">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Contest Statistics</h2>
          <p className="mt-1 text-sm text-gray-500">Your contest progress at a glance.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-gray-900">{loading ? "..." : stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Participation History */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Recent Participation</h2>
        
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading history...</div>
        ) : history.length > 0 ? (
          <div className="mt-5 space-y-4">
            {history.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.category} • {item.event_mode} • {item.date}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  item.result_status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                }`}>
                  {item.result_status === 'pending' ? 'Upcoming / Pending' : 'Completed'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="font-medium text-gray-700">No contest participation yet</p>
            <p className="mt-2 text-sm text-gray-500">Contests you join will appear here.</p>
            <Link to="/" className="mt-5 inline-flex rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-800">
              Explore Contests
            </Link>
          </div>
        )}
      </section>

      {/* Achievements */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Recent Achievements</h2>

        {loading ? (
          <div className="py-6 text-center text-sm text-gray-500">Loading achievements...</div>
        ) : achievements.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.slice(0, 4).map((achievement, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                  🏆
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-1">{achievement.contest_name}</h4>
                  <p className="text-xs text-gray-500 capitalize">
                    {achievement.position === "participated" ? "Participant" : `${achievement.position} Place`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-gray-500 text-center py-6 border border-dashed border-gray-200 rounded-xl">
            Your verified awards and contest placements will appear here when organizers publish the results.
          </p>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link to="/portfolio" className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
            <h3 className="font-semibold text-gray-900">View Portfolio</h3>
            <p className="mt-2 text-sm text-gray-500">View or download your professional portfolio.</p>
          </Link>
          <Link to="/saved" className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
            <h3 className="font-semibold text-gray-900">Saved Contests</h3>
            <p className="mt-2 text-sm text-gray-500">Find the contests you saved earlier.</p>
          </Link>
          <Link to="/settings" className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
            <h3 className="font-semibold text-gray-900">Profile Settings</h3>
            <p className="mt-2 text-sm text-gray-500">Update your personal information and skills.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;