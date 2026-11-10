import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user } = useAuth(); // AuthContext থেকে লগইন হওয়া യൂজার ও তার Role পাওয়া যাবে
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // ইউজার লগইন না থাকলে API কল হবে না
    if (!user) {
      setProfile({});
      return;
    }

    const fetchProfile = async () => {
      try {
        // রোল অনুযায়ী সঠিক API বেছে নেওয়া
        const endpoint =
          user.role === "organizer"
            ? "http://localhost/ContestBoard/backend/auth/organizers/get_profile.php"
            : "http://localhost/ContestBoard/backend/auth/students/get_profile.php";

        const response = await axios.get(endpoint, { withCredentials: true });

        if (response.data.success) {
          setProfile(response.data.profile);
        }
      } catch (error) {
        console.error("Could not fetch profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  function updateProfile(updates) {
    setProfile((current) => ({
      ...current,
      ...updates,
    }));
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return context;
}