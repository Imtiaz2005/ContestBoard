
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ProfileContext = createContext(null);

const defaultProfile = {
  name: "Student Name",
  email: "student@example.com",
  phone: "",
  photo: "",
  university: "",
  department: "",
  bio: "",
  skills: "",
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("contestboard-profile");
      return savedProfile
        ? { ...defaultProfile, ...JSON.parse(savedProfile) }
        : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "contestboard-profile",
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error("Could not save profile:", error);
    }
  }, [profile]);

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
