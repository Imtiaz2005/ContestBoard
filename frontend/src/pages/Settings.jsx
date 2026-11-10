import { useState, useRef } from "react";
import { useProfile } from "../context/ProfileContext";
import axios from "axios"; // পরের ধাপে API কানেক্ট করার সময় লাগবে

function Settings() {
  const { profile, updateProfile } = useProfile();

  // Messages and File States
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile.photo || "");

  // Password States
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const fileInputRef = useRef(null);
  const isOrganizer = profile.role === "organizer";

  // Handle Profile Inputs
  function handleProfileChange(event) {
    const { name, value } = event.target;
    updateProfile({ [name]: value });
    setProfileMessage("");
  }

  // Handle Password Inputs
  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setPasswordMessage("");
  }

  // Handle Image Selection from Device
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary local URL to preview the image immediately
      setPreviewUrl(URL.createObjectURL(file));
      setProfileMessage("");
    }
  }

  // Profile Form Submit (Will use FormData for Image)
  async function handleProfileSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);

    formData.append("phone", profile.phone || "");
    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    if (!isOrganizer) {
      formData.append("university", profile.university || "");
      formData.append("department", profile.department || "");
      formData.append("skills", profile.skills || "");
      formData.append("bio", profile.bio || "");
    } else {
      formData.append("organizationName", profile.organizationName || "");
    }

    try {
      // Axios request
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/auth/students/update_profile.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true // Session cookie পাঠানোর জন্য এটি মাস্ট!
        }
      );

      if (response.data.success) {
        setProfileMessage("Profile updated successfully!");

        // ছবির ফুল URL তৈরি করে context আপডেট করা 
        if (response.data.photo_url) {
          const fullImageUrl = "http://localhost/ContestBoard/backend/" + response.data.photo_url;
          updateProfile({ ...profile, photo: fullImageUrl });
        }
      } else {
        setProfileMessage(response.data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setProfileMessage("An error occurred while updating profile.");
    }
  }

  // Password Form Submit
  // Password Form Submit
  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage("New passwords do not match!");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      // JSON ডাটা পাঠাবো, তাই সাধারণ axios post (FormData লাগবে না)
      const response = await axios.post(
        "http://localhost/ContestBoard/backend/auth/change_password.php", // পাথটি আপনার ফোল্ডার অনুযায়ী ঠিক করে নিবেন
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        {
          withCredentials: true // সেশন চেক করার জন্য এটি মাস্ট
        }
      );

      if (response.data.success) {
        setPasswordMessage("Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" }); // ফর্ম ক্লিয়ার করে দেওয়া
      } else {
        setPasswordMessage(response.data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setPasswordMessage(err.response?.data?.message || "An error occurred while updating password.");
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-500">
          Manage your profile and account information.
        </p>
      </div>

      {/* ================= PROFILE FORM ================= */}
      <form onSubmit={handleProfileSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isOrganizer ? "Manage your organizer account details." : "Manage your student profile details."}
          </p>
        </div>

        {/* Profile Picture Upload Section */}
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
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
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Change Photo
            </button>
            <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF (Max. 2MB)</p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="name"
            value={profile.name || ""}
            onChange={handleProfileChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={profile.email || ""}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed from Settings.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone || ""}
            onChange={handleProfileChange}
            placeholder="Enter your mobile number"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
        </div>

        {/* Dynamic Fields based on Role */}
        {isOrganizer ? (
          <>
            {/* Organizer fields logic unchanged... */}
          </>
        ) : (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">University</label>
              <input
                name="university"
                value={profile.university || ""}
                onChange={handleProfileChange}
                placeholder="Your university"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Department</label>
              <input
                name="department"
                value={profile.department || ""}
                onChange={handleProfileChange}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Skills</label>
              <input
                name="skills"
                value={profile.skills || ""}
                onChange={handleProfileChange}
                placeholder="C++, React, Problem Solving"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>
          </>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">About (Bio)</label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleProfileChange}
            rows={4}
            placeholder="Write a short introduction..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-indigo-700 px-5 py-3 font-medium text-white hover:bg-indigo-800">
          Save Profile Changes
        </button>

        {profileMessage && <p className="text-sm font-medium text-indigo-700">{profileMessage}</p>}
      </form>

      {/* ================= PASSWORD FORM ================= */}
      <form onSubmit={handlePasswordSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Password & Security</h2>
          <p className="mt-1 text-sm text-gray-500">Update your password to keep your account secure.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <button type="submit" className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800">
          Update Password
        </button>

        {passwordMessage && (
          <p className={`text-sm font-medium ${passwordMessage.includes("successfully") ? "text-green-700" : "text-red-600"}`}>
            {passwordMessage}
          </p>
        )}
      </form>
    </section>
  );
}

export default Settings;