import { createContext, useContext, useState, useCallback } from "react";
import { getStudentProfile, completeStudentProfile } from "../services/api";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true); // true = show spinner immediately on first render
  const [profileError, setProfileError] = useState(null);

  /** Fetch the student's profile from the backend */
  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await getStudentProfile();
      console.log("studentProfileres", data);
      setProfile(data);
      return data;
    } catch (err) {
      setProfileError(err.message || "Failed to load profile");
      throw err;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  /** Submit the profile completion payload, then re-fetch */
  const submitProfile = useCallback(async (payload) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      await completeStudentProfile(payload);
      const data = await getStudentProfile();
      setProfile(data);
      return data;
    } catch (err) {
      setProfileError(err.message || "Failed to save profile");
      throw err;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, profileLoading, profileError, fetchProfile, submitProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
};
