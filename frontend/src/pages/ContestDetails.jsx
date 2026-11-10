import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function formatDate(date) {
  if (!date) return "Not announced";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ContestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [similarContests, setSimilarContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Overview");
  const [saved, setSaved] = useState(false);
  const [registering, setRegistering] = useState(false);

  // ডাটাবেজ থেকে নির্দিষ্ট কনটেস্টের ডাটা লোড করা
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `http://localhost/ContestBoard/backend/api/contests/get_single_contest.php?id=${id}`
        );
        if (response.data.success) {
          setContest(response.data.contest);
          setSimilarContests(response.data.similarContests || []);
        } else {
          setContest(null);
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchContest();
  }, [id]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-lg font-semibold text-gray-500">Loading contest details...</div>;
  }

  if (!contest) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Contest not found</h1>
        <p className="mt-2 text-gray-500">This contest may not exist, pending approval, or has been removed.</p>
        <Link to="/" className="mt-5 inline-block rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-800">
          Back to Discover
        </Link>
      </div>
    );
  }

  // ডাটাবেজ থেকে পাওয়া ফিল্ডগুলো ম্যাপিং
  const title = contest.title;
  const category = contest.category;
  const banner = contest.banner_url;
  const mode = contest.event_mode || "Online";
  const venue = contest.venue;
  const description = contest.description;
  const eligibility = contest.eligibility;
  const teamMin = contest.team_min ?? 1;
  const teamMax = contest.team_max ?? 1;

  const registrationStart = contest.registration_start;
  const deadline = contest.registration_deadline;
  const contestStart = contest.contest_start;
  const contestEnd = contest.contest_end;
  const resultsDate = contest.results_date;

  const registrationUrl = contest.registration_url;
  const fee = Number(contest.registration_fee ?? 0);
  const participantLimit = contest.participant_limit;

  const prizes = [
    { label: "1st place", value: contest.prize_first },
    { label: "2nd place", value: contest.prize_second },
    { label: "3rd place", value: contest.prize_third },
  ];

  const rules = (contest.rules || "").split("\n").filter(Boolean);
  const faq = (contest.faq || "").split("\n").filter(Boolean);

  const organizerName = contest.organizer_name || "Organizer";
  const organizerEmail = contest.organizer_email;

  const tabs = ["Overview", "Schedule", "Prizes", "Rules", "FAQ"];
  const spotsText = participantLimit ? `Limited to ${participantLimit} participants` : "No participant limit specified";

  const daysLeft = deadline
    ? Math.ceil((new Date(deadline + "T23:59:59") - new Date()) / (1000 * 60 * 60 * 24))
    : null;


  // আপডেট করা রেজিস্ট্রেশন লজিক
  const handleRegister = async () => {
    setRegistering(true);

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/api/contests/register_contest.php",
        { contest_id: id },
        { withCredentials: true } // সেশন থেকে user_id নেওয়ার জন্য মাস্ট
      );

      if (response.data.success) {
        alert(response.data.message); // ডাটাবেজে সেভ হওয়ার সাকসেস মেসেজ

        // (ঐচ্ছিক) ডাটাবেজে সেভ হওয়ার পর যদি এক্সটার্নাল কোনো লিংক থাকে, তখন সেটা ওপেন করবে
        if (registrationUrl && !registrationUrl.includes("localhost")) {
          window.open(registrationUrl, "_blank", "noopener,noreferrer");
        }
      } else {
        if (response.data.message.includes("log in") || response.data.message.includes("authenticated")) {
          alert("Please login as a student to register for contests.");
          navigate("/login");
        } else {
          alert(response.data.message); // যেমন: Already registered মেসেজ
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Make sure you are logged in as a student.");
    } finally {
      setRegistering(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Schedule":
        return (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">Contest Schedule</h2>
            <div className="mt-5 space-y-5">
              {[
                ["Registration opens", registrationStart],
                ["Registration deadline", deadline],
                ["Contest starts", contestStart],
                ["Contest ends", contestEnd],
                ["Results announced", resultsDate],
              ].map(([label, date]) => (
                <div key={label} className="flex gap-3">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-sm text-gray-500">{formatDate(date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "Prizes":
        return (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">Prizes</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {prizes.map((prize) => (
                <div key={prize.label} className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">{prize.label}</p>
                  <p className="mt-2 font-semibold text-gray-900">{prize.value || "Not announced"}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case "Rules":
        return (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">Rules and Guidelines</h2>
            {rules.length ? (
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
                {rules.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">Rules will be announced by the organizer.</p>
            )}
          </section>
        );

      case "FAQ":
        return (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
            {faq.length ? (
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                {faq.map((item, index) => <li key={index} className="rounded-lg bg-gray-50 p-3">{item}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">No FAQs available yet.</p>
            )}
          </section>
        );

      default:
        return (
          <>
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">About this contest</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {description || "No description provided yet."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border px-3 py-2 text-xs text-gray-700">{category}</span>
                <span className="rounded-full border px-3 py-2 text-xs text-gray-700">
                  Teams of {teamMin === teamMax ? teamMin : `${teamMin}–${teamMax}`}
                </span>
                <span className="rounded-full border px-3 py-2 text-xs text-gray-700">
                  {eligibility || "Eligibility not specified"}
                </span>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb]">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <div className="text-xs text-gray-500">
          <Link to="/" className="text-indigo-600 hover:underline">Discover</Link>
          {" / "}<span>{category}</span>{" / "}
          <span className="text-gray-700">{title}</span>
        </div>

        <section
          className="relative flex min-h-[170px] items-end overflow-hidden rounded-2xl bg-indigo-700 bg-cover bg-center p-6 sm:p-8"
          style={banner ? { backgroundImage: `url("${banner}")` } : {}}
        >
          {banner && <div className="absolute inset-0 bg-black/35" />}
          <div className="relative z-10">
            {daysLeft !== null && daysLeft >= 0 && (
              <span className="rounded-md bg-amber-200 px-2 py-1 text-xs font-semibold text-gray-900">
                {daysLeft === 0 ? "Registration closes today" : `${daysLeft} days left to register`}
              </span>
            )}
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="font-semibold text-gray-900">{organizerName}</span>
          <span className="rounded-md bg-green-100 px-2 py-1 text-green-700">Verified organizer</span>
          <span>{mode}{mode !== "Online" && venue ? ` · ${venue}` : ""}</span>
          <span>{formatDate(contestStart)}{contestEnd ? ` – ${formatDate(contestEnd)}` : ""}</span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex gap-6 overflow-x-auto border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm ${activeTab === tab ? "border-indigo-600 font-semibold text-indigo-700" : "border-transparent text-gray-600 hover:text-indigo-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                  {fee === 0 ? "Free Entry" : `৳${fee}`}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500">Deadline: {formatDate(deadline)}</p>
                <p className="mt-2 text-xs text-gray-500">{spotsText}</p>
              </div>

              <button
                onClick={handleRegister}
                disabled={registering || (daysLeft !== null && daysLeft < 0)}
                className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${daysLeft !== null && daysLeft < 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-700 hover:bg-indigo-800"
                  }`}
              >
                {daysLeft !== null && daysLeft < 0
                  ? "Registration Closed"
                  : registering ? "Registering..." : "Register Now"}
              </button>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-bold text-gray-900">Organizer</h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">
                  {organizerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{organizerName}</p>
                  <p className="text-xs text-gray-500">{contest.organization_type || "Organization"}</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Similar Contests */}
        {similarContests.length > 0 && (
          <section className="pt-3">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Similar events</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarContests.map((item) => (
                <Link
                  key={item.contest_id}
                  to={`/contests/${item.contest_id}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(item.contest_start)} {" · "} {item.event_mode}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ContestDetails;