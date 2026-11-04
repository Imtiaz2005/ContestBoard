
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const sampleContests = {
  1: {
    title: "Inter-University Hackathon",
    category: "Programming",
    banner_url: "",
    event_mode: "Offline",
    venue: "UITS Campus",
    description: "A programming competition for university students.",
    eligibility: "University students",
    team_min: "2",
    team_max: "4",
    rules: "Participants must follow the competition rules.",
    registration_start: "2026-11-01",
    registration_deadline: "2026-12-05",
    contest_start: "2026-12-12",
    contest_end: "2026-12-14",
    results_date: "2026-12-15",
    registration_url: "https://example.com/register",
    registration_fee: "0",
    participant_limit: "",
    prize_first: "৳20,000",
    prize_second: "৳10,000",
    prize_third: "৳5,000",
    contact_email: "",
    contact_phone: "",
    faq: "",
  },
  2: {
    title: "Robotics Challenge",
    category: "Robotics",
    banner_url: "",
    event_mode: "Hybrid",
    venue: "UITS Campus",
    description: "A robotics competition.",
    eligibility: "University students",
    team_min: "2",
    team_max: "4",
    rules: "Follow the competition rules.",
    registration_start: "2026-11-01",
    registration_deadline: "2026-12-12",
    contest_start: "2026-12-20",
    contest_end: "2026-12-20",
    results_date: "",
    registration_url: "https://example.com/register",
    registration_fee: "0",
    participant_limit: "",
    prize_first: "",
    prize_second: "",
    prize_third: "",
    contact_email: "",
    contact_phone: "",
    faq: "",
  },
  3: {
    title: "Business Case Competition",
    category: "Business",
    banner_url: "",
    event_mode: "Online",
    venue: "",
    description: "Solve real-world business problems.",
    eligibility: "University students",
    team_min: "1",
    team_max: "4",
    rules: "Follow the competition rules.",
    registration_start: "2026-12-01",
    registration_deadline: "2027-01-03",
    contest_start: "2027-01-10",
    contest_end: "2027-01-10",
    results_date: "",
    registration_url: "https://example.com/register",
    registration_fee: "0",
    participant_limit: "",
    prize_first: "",
    prize_second: "",
    prize_third: "",
    contact_email: "",
    contact_phone: "",
    faq: "",
  },
};

const categories = [
  "Programming",
  "Robotics",
  "Business",
  "Design",
  "Debate",
  "Sports",
  "Science",
  "Other",
];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const labelClass = "block text-sm font-medium text-gray-700";

const EditContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => {
    const contest = sampleContests[id];

    return contest ? { ...contest } : null;
  });

  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const renderInput = (
    name,
    label,
    type = "text",
    required = false
  ) => (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={form[name] ?? ""}
        onChange={updateField}
        required={required}
        min={type === "number" ? "0" : undefined}
        className={inputClass}
      />
    </div>
  );

  const renderTextarea = (name, label, required = false) => (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={form[name] ?? ""}
        onChange={updateField}
        required={required}
        rows={4}
        className={inputClass}
      />
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      form.registration_deadline < form.registration_start
    ) {
      setError("Registration deadline cannot be before registration opens.");
      return;
    }

    if (form.contest_end < form.contest_start) {
      setError("Contest end date cannot be before its start date.");
      return;
    }

    if (
      Number(form.team_min) < 1 ||
      Number(form.team_max) < Number(form.team_min)
    ) {
      setError("Please enter a valid team size.");
      return;
    }

    if (!/^https?:\/\/\S+$/i.test(form.registration_url)) {
      setError("Enter a valid external registration URL.");
      return;
    }

    // Temporary: no database update until the PHP API is ready.
    console.log("Contest ID to update:", id);
    console.log("Updated contest data:", form);

    alert(
      "Validation successful! The PUT API will be connected later."
    );
  };

  if (!form) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Contest not found
        </h1>

        <p className="mt-2 text-gray-600">
          This sample contest does not exist.
        </p>

        <Link
          to="/organizer/contests"
          className="mt-5 inline-block font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Back to Manage Contests
        </Link>
      </div>
    );
  }

  const sectionClass =
    "space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6";

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <Link
          to="/organizer/contests"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Manage Contests
        </Link>

        <p className="mt-5 text-sm font-semibold text-indigo-600">
          ORGANIZER PANEL
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Edit Contest
        </h1>

        <p className="mt-2 text-gray-600">
          Update the details of your existing contest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">
            1. Basic Information
          </h2>

          {renderInput("title", "Contest title", "text", true)}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={updateField}
                required
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="event_mode" className={labelClass}>
                Event mode *
              </label>

              <select
                id="event_mode"
                name="event_mode"
                value={form.event_mode}
                onChange={updateField}
                required
                className={inputClass}
              >
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          {renderInput("banner_url", "Banner image URL", "url")}
          {renderInput("venue", "Venue / online platform")}
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">
            2. Description & Eligibility
          </h2>

          {renderTextarea("description", "Contest description", true)}
          {renderTextarea("eligibility", "Eligibility", true)}
          {renderTextarea("rules", "Rules & guidelines", true)}

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("team_min", "Minimum team members", "number", true)}
            {renderInput("team_max", "Maximum team members", "number", true)}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">
            3. Important Dates
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("registration_start", "Registration opens", "date", true)}
            {renderInput("registration_deadline", "Registration deadline", "date", true)}
            {renderInput("contest_start", "Contest starts", "date", true)}
            {renderInput("contest_end", "Contest ends", "date", true)}
            {renderInput("results_date", "Results announcement date", "date")}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">
            4. Registration
          </h2>

          {renderInput("registration_url", "External registration link", "url", true)}

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("registration_fee", "Registration fee", "number", true)}
            {renderInput("participant_limit", "Maximum participants", "number")}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">
            5. Prizes
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            {renderInput("prize_first", "1st place prize")}
            {renderInput("prize_second", "2nd place prize")}
            {renderInput("prize_third", "3rd place prize")}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">
            6. Contact & FAQ
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("contact_email", "Contact email", "email")}
            {renderInput("contact_phone", "Contact phone", "tel")}
          </div>

          {renderTextarea("faq", "Frequently asked questions")}
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/organizer/contests")}
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContest;
