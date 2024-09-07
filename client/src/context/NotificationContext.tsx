import React, { createContext, useContext, useState } from "react";

import NotificationContainer from "../components/ui/NotificationContainer"

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = ({ title, message, type }) => {
    const id = Date.now();
    setNotifications((prev) => [
      ...prev,
      { id, title, message, type }
    ]);

    // Automatically remove the notification after 3 seconds
    setTimeout(() => {
      setNotifications((currentNotifications) =>
        currentNotifications.filter((n) => n.id !== id)
      );
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={addNotification}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
