import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const initialProfile = {
  name: "",
  email: "",
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
  const [passwordMessage, setPasswordMessage] = useState("");
  
  // Image Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // Password States
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load Organizer Data on Mount
  useEffect(() => {
    const fetchOrganizerProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost/ContestBoard/backend/auth/organizers/get_profile.php",
          { withCredentials: true }
        );
        if (response.data.success && response.data.profile) {
          const data = response.data.profile;
          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            photo: data.photo || "",
            organizationName: data.organizationName || "",
            organizationType: data.organizationType || "University",
            website: data.website || "",
            aboutOrganization: data.aboutOrganization || "",
          });
          if (data.photo) setPreviewUrl(data.photo);
        }
      } catch (err) {
        console.error("Error fetching organizer profile:", err);
      }
    };

    fetchOrganizerProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setPasswordMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage("");
    }
  };

  // Submit Profile Changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone", profile.phone || "");
    formData.append("organizationName", profile.organizationName || "");
    formData.append("organizationType", profile.organizationType || "University");
    formData.append("website", profile.website || "");
    formData.append("aboutOrganization", profile.aboutOrganization || "");

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/auth/organizers/update_profile.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessage("Profile updated successfully!");
        if (response.data.photo_url) {
          setPreviewUrl("http://localhost/ContestBoard/backend/" + response.data.photo_url);
        }
      } else {
        setMessage(response.data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while updating profile.");
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage("New passwords do not match!");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/auth/change_password.php",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setPasswordMessage("Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMessage(response.data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setPasswordMessage(err.response?.data?.message || "An error occurred while updating password.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            to="/organizer/dashboard"
            className="mb-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </Link>

          <div className="mb-2">
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
        </div>

        {/* PROFILE FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal information */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 space-y-6">
            <div>
              <h2 className="mb-1 text-xl font-bold text-slate-900">
                Personal Information
              </h2>
              <p className="text-sm text-slate-500">Your organizer account details.</p>
            </div>

            {/* Profile Photo Section */}
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {previewUrl ? (
                  <img src={previewUrl} alt="Organizer Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "O"}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Change Photo
                </button>
                <p className="mt-2 text-xs text-slate-500">JPG, PNG or GIF (Max. 2MB)</p>
              </div>
            </div>

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
                <p className="mt-1 text-xs text-slate-500">Email cannot be changed.</p>
              </div>

              <div className="sm:col-span-2">
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
              className={`rounded-lg border p-4 text-sm ${
                message.includes("successfully")
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
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

        {/* PASSWORD CHANGE FORM */}
        <form onSubmit={handlePasswordSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Password & Security</h2>
            <p className="mt-1 text-sm text-slate-500">Update your account password.</p>
          </div>

          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Update Password
          </button>

          {passwordMessage && (
            <p
              className={`text-sm font-medium ${
                passwordMessage.includes("successfully") ? "text-green-700" : "text-red-600"
              }`}
            >
              {passwordMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}