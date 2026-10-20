
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("contestboard-saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "contestboard-saved",
      JSON.stringify(savedIds)
    );
  }, [savedIds]);

  function toggleSaved(id) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  }

  return (
    <SavedContext.Provider value={{ savedIds, toggleSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSavedContests() {
  const context = useContext(SavedContext);

  if (!context) {
    throw new Error(
      "useSavedContests must be used inside SavedProvider"
    );
  }

  return context;
}
