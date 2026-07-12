import { createContext, useContext, useState, useCallback } from "react";
import { getPersonalNotifications } from "../services/notificationApi";
import { getNotifications as getGeneralNotifications } from "../services/publicApi";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [personalNotifications, setPersonalNotifications] = useState([]);
  const [generalNotifications, setGeneralNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPersonalNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPersonalNotifications();
      const list = Array.isArray(data) ? data : data?.notifications || [];
      setPersonalNotifications(list);
      return list;
    } catch (err) {
      setError(err.message || "Failed to fetch personal notifications");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGeneralNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGeneralNotifications({ page: 1, limit: 100 });
      const list = data?.notifications || [];
      setGeneralNotifications(list);
      return list;
    } catch (err) {
      setError(err.message || "Failed to fetch general announcements");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        personalNotifications,
        generalNotifications,
        loading,
        error,
        fetchPersonalNotifications,
        fetchGeneralNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext must be used inside <NotificationProvider>");
  return ctx;
};
