import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const categories = [
  "Programming", "Robotics", "Business", "Design", 
  "Debate", "Sports", "Science", "Other",
];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const labelClass = "block text-sm font-medium text-gray-700";

const EditContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ১. পেজ লোড হওয়ার সময় ডাটাবেজ থেকে কনটেস্টের ডাটা আনা
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `http://localhost/ContestBoard/backend/api/contests/get_contest.php?id=${id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setForm(response.data.contest);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch contest:", err);
        setError("Error loading contest data.");
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ২. আপডেট করার API কল করা
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.registration_deadline < form.registration_start) {
      setError("Registration deadline cannot be before registration opens.");
      return;
    }
    if (form.contest_end < form.contest_start) {
      setError("Contest end date cannot be before its start date.");
      return;
    }
    if (Number(form.team_min) < 1 || Number(form.team_max) < Number(form.team_min)) {
      setError("Please enter a valid team size.");
      return;
    }
    if (!/^https?:\/\/\S+$/i.test(form.registration_url)) {
      setError("Enter a valid external registration URL.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/api/contests/update_contest.php",
        { ...form, contest_id: id }, // form-এর সাথে ID পাঠিয়ে দেওয়া হচ্ছে
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess("Contest updated successfully! Redirecting...");
        setTimeout(() => navigate("/organizer/contests"), 1500);
      } else {
        setError(response.data.message || "Failed to update contest.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the contest.");
    }
  };

  const renderInput = (name, label, type = "text", required = false) => (
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

  if (loading) {
    return <div className="p-10 text-center text-lg font-semibold text-gray-500">Loading contest data...</div>;
  }

  if (!form && !loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Contest not found</h1>
        <p className="mt-2 text-gray-600">This contest does not exist or you don't have permission to edit it.</p>
        <Link to="/organizer/contests" className="mt-5 inline-block font-semibold text-indigo-600 hover:text-indigo-700">
          Back to Manage Contests
        </Link>
      </div>
    );
  }

  const sectionClass = "space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6";

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <Link to="/organizer/contests" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← Back to Manage Contests
        </Link>
        <p className="mt-5 text-sm font-semibold text-indigo-600">ORGANIZER PANEL</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Edit Contest</h1>
        <p className="mt-2 text-gray-600">Update the details of your existing contest.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">1. Basic Information</h2>
          {renderInput("title", "Contest title", "text", true)}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className={labelClass}>Category *</label>
              <select id="category" name="category" value={form.category} onChange={updateField} required className={inputClass}>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="event_mode" className={labelClass}>Event mode *</label>
              <select id="event_mode" name="event_mode" value={form.event_mode} onChange={updateField} required className={inputClass}>
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
          <h2 className="text-xl font-bold text-gray-900">2. Description & Eligibility</h2>
          {renderTextarea("description", "Contest description", true)}
          {renderTextarea("eligibility", "Eligibility", true)}
          {renderTextarea("rules", "Rules & guidelines", true)}
          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("team_min", "Minimum team members", "number", true)}
            {renderInput("team_max", "Maximum team members", "number", true)}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">3. Important Dates</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("registration_start", "Registration opens", "date", true)}
            {renderInput("registration_deadline", "Registration deadline", "date", true)}
            {renderInput("contest_start", "Contest starts", "date", true)}
            {renderInput("contest_end", "Contest ends", "date", true)}
            {renderInput("results_date", "Results announcement date", "date")}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">4. Registration</h2>
          {renderInput("registration_url", "External registration link", "url", true)}
          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("registration_fee", "Registration fee", "number", true)}
            {renderInput("participant_limit", "Maximum participants", "number")}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">5. Prizes</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {renderInput("prize_first", "1st place prize")}
            {renderInput("prize_second", "2nd place prize")}
            {renderInput("prize_third", "3rd place prize")}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-bold text-gray-900">6. Contact & FAQ</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {renderInput("contact_email", "Contact email", "email")}
            {renderInput("contact_phone", "Contact phone", "tel")}
          </div>
          {renderTextarea("faq", "Frequently asked questions")}
        </section>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate("/organizer/contests")} className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditContest;