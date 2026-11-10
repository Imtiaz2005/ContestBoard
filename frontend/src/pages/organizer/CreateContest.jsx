
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const initialForm = {
  title: "",
  category: "Programming",
  banner_url: "",
  event_mode: "Online",
  venue: "",
  description: "",
  eligibility: "",
  team_min: "1",
  team_max: "1",
  rules: "",
  registration_start: "",
  registration_deadline: "",
  contest_start: "",
  contest_end: "",
  results_date: "",
  registration_fee: "0",
  participant_limit: "",
  prize_first: "",
  prize_second: "",
  prize_third: "",
  registration_url: "",
  contact_email: "",
  contact_phone: "",
  faq: "",
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
  "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const labelClass = "block text-sm font-medium text-gray-700";

const CreateContest = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => { // async যোগ করা হয়েছে
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.registration_deadline && form.registration_start && form.registration_deadline < form.registration_start) {
      setError("Registration deadline cannot be before registration opens.");
      return;
    }
    if (form.contest_start && form.contest_end && form.contest_end < form.contest_start) {
      setError("Contest end date cannot be before its start date.");
      return;
    }
    if (Number(form.team_min) < 1 || Number(form.team_max) < Number(form.team_min)) {
      setError("Please enter a valid minimum and maximum team size.");
      return;
    }
    if (form.registration_url && !/^https?:\/\/\S+$/i.test(form.registration_url)) {
      setError("Registration link must start with http:// or https://.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/api/contests/create.php", // আপনার ব্যাকএন্ড পাথ দিন
        form,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // সেশন থেকে organizer_id নেওয়ার জন্য এটি মাস্ট
        }
      );

      if (response.data.success) {
        setSuccess("Contest created successfully! Redirecting to dashboard...");
        // ২ সেকেন্ড পর ড্যাশবোর্ডে নিয়ে যাবে
        setTimeout(() => {
          navigate("/organizer/dashboard");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to create contest.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the contest.");
    }
  };

  const renderInput = (
    name,
    label,
    type = "text",
    required = false,
    placeholder = ""
  ) => (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={updateField}
        required={required}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        className={inputClass}
      />
    </div>
  );

  const renderTextarea = (name, label, required = false, rows = 4) => (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={form[name]}
        onChange={updateField}
        required={required}
        rows={rows}
        className={inputClass}
      />
    </div>
  );

  const sectionClass =
    "space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6";

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          ORGANIZER PANEL
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Create a Contest
        </h1>
        <p className="mt-2 text-gray-600">
          Add your contest details and submit them for admin approval.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic information */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              1. Basic Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              The basic details displayed on the contest card.
            </p>
          </div>

          {renderInput("title", "Contest title", "text", true,
            "e.g. Inter-University Hackathon")}

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

          {renderInput(
            "banner_url",
            "Banner image URL (optional)",
            "url",
            false,
            "https://example.com/banner.jpg"
          )}

          {renderInput(
            "venue",
            "Venue / online platform",
            "text",
            false,
            "e.g. UITS Campus or Google Meet"
          )}
        </section>

        {/* Description */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              2. Description & Eligibility
            </h2>
          </div>

          {renderTextarea("description", "About this contest", true, 5)}
          {renderTextarea("eligibility", "Eligibility", true, 3)}
          {renderTextarea("rules", "Rules & guidelines", true, 5)}

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("team_min", "Minimum team members", "number", true)}
            {renderInput("team_max", "Maximum team members", "number", true)}
          </div>
        </section>

        {/* Dates */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              3. Important Dates
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("registration_start", "Registration opens", "date", true)}
            {renderInput("registration_deadline", "Registration deadline", "date", true)}
            {renderInput("contest_start", "Contest starts", "date", true)}
            {renderInput("contest_end", "Contest ends", "date", true)}
            {renderInput("results_date", "Results announcement date", "date")}
          </div>
        </section>

        {/* Registration */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              4. Registration
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Register Now will open the external link provided here.
            </p>
          </div>

          {renderInput(
            "registration_url",
            "External registration link",
            "url",
            true,
            "https://forms.google.com/..."
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("registration_fee", "Registration fee", "number", true)}
            {renderInput("participant_limit", "Maximum participants (optional)", "number")}
          </div>

          <p className="text-xs text-gray-500">
            Enter 0 for a free contest. External registrations will not
            automatically create ContestBoard participant records.
          </p>
        </section>

        {/* Prizes */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              5. Prizes
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Describe the prize for each position, including cash or gifts.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {renderInput("prize_first", "1st place prize")}
            {renderInput("prize_second", "2nd place prize")}
            {renderInput("prize_third", "3rd place prize")}
          </div>
        </section>

        {/* Contact and FAQ */}
        <section className={sectionClass}>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              6. Contact & FAQ
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("contact_email", "Contact email", "email")}
            {renderInput("contact_phone", "Contact phone", "tel")}
          </div>

          {renderTextarea("faq", "Frequently asked questions (optional)", false, 4)}
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {/* Success Message */}
        {success && (
          <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/organizer/dashboard")}
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContest;
