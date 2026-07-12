import { createContext, useContext, useState, useEffect, useCallback } from "react";

const defaultResume = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    website: "",
  },
  summary: "",
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
  hiddenSections: [],
};

const STORAGE_KEY = "ncc_resume_data";

export const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultResume,
          ...parsed,
          personal: { ...defaultResume.personal, ...(parsed.personal || {}) },
        };
      }
    } catch {}
    return defaultResume;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    } catch {}
  }, [resume]);

  const updatePersonal = useCallback((data) => {
    setResume((prev) => ({ ...prev, personal: { ...prev.personal, ...data } }));
  }, []);

  const updateSummary = useCallback((summary) => {
    setResume((prev) => ({ ...prev, summary }));
  }, []);

  const updateSection = useCallback((section, data) => {
    setResume((prev) => ({ ...prev, [section]: data }));
  }, []);

  const toggleHideSection = useCallback((section) => {
    setResume((prev) => {
      const hidden = prev.hiddenSections || [];
      return {
        ...prev,
        hiddenSections: hidden.includes(section)
          ? hidden.filter((s) => s !== section)
          : [...hidden, section],
      };
    });
  }, []);

  const addCustomSection = useCallback((section) => {
    setResume((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), section],
    }));
  }, []);

  const updateCustomSection = useCallback((id, data) => {
    setResume((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    }));
  }, []);

  const removeCustomSection = useCallback((id) => {
    setResume((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((s) => s.id !== id),
    }));
  }, []);

  const resetResume = useCallback(() => {
    setResume(defaultResume);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resume,
        updatePersonal,
        updateSummary,
        updateSection,
        toggleHideSection,
        addCustomSection,
        updateCustomSection,
        removeCustomSection,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
