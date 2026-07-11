/**
 * NccProfileContext.jsx
 * Context + provider for the student's NCC profile state.
 * Provides: nccProfile, nccLoading, nccError, fetchNccProfile, createProfile, updateProfile
 */
import { createContext, useContext, useState, useCallback } from "react";
import { getNccProfile, createNccProfile, updateNccProfile } from "../services/nccProfileApi";

const NccProfileContext = createContext(null);

export function NccProfileProvider({ children }) {
  const [nccProfile, setNccProfile] = useState(undefined); // undefined = not yet fetched
  const [nccLoading, setNccLoading] = useState(false);
  const [nccError, setNccError] = useState(null);

  /** Fetch the NCC profile from the backend. Sets null if not yet created. */
  const fetchNccProfile = useCallback(async () => {
    setNccLoading(true);
    setNccError(null);
    try {
      const data = await getNccProfile();
      setNccProfile(data); // null if 404 / not created
      return data;
    } catch (err) {
      setNccError(err.message || "Failed to load NCC profile");
      throw err;
    } finally {
      setNccLoading(false);
    }
  }, []);

  /** Create a new NCC profile, then refresh state. */
  const createProfile = useCallback(async (payload) => {
    setNccLoading(true);
    setNccError(null);
    try {
      const data = await createNccProfile(payload);
      // After creation, re-fetch to get the latest persisted data
      const fresh = await getNccProfile();
      setNccProfile(fresh ?? data);
      return fresh ?? data;
    } catch (err) {
      setNccError(err.message || "Failed to create NCC profile");
      throw err;
    } finally {
      setNccLoading(false);
    }
  }, []);

  /** Update the existing NCC profile, then refresh state. */
  const updateProfile = useCallback(async (payload) => {
    setNccLoading(true);
    setNccError(null);
    try {
      await updateNccProfile(payload);
      const fresh = await getNccProfile();
      setNccProfile(fresh);
      return fresh;
    } catch (err) {
      setNccError(err.message || "Failed to update NCC profile");
      throw err;
    } finally {
      setNccLoading(false);
    }
  }, []);

  return (
    <NccProfileContext.Provider
      value={{ nccProfile, nccLoading, nccError, fetchNccProfile, createProfile, updateProfile }}
    >
      {children}
    </NccProfileContext.Provider>
  );
}

export const useNccProfile = () => {
  const ctx = useContext(NccProfileContext);
  if (!ctx) throw new Error("useNccProfile must be used inside <NccProfileProvider>");
  return ctx;
};
