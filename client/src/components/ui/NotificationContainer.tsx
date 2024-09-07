import React from "react";

const NotificationContainer = ({ notifications }) => {
  return (
    <div className="fixed top-2 left-0 p-[0.5rem] z-[1000] w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex gap-4 mb-[10] p-4 rounded-lg shadow-md shadow-[#1A1A1A] bg-black"
        >
          <div>
            <img 
              src={`/assets/icons/${notification.type}.svg`}
              alt={notification.type}
              className="w-[3rem] h-[3rem]"
            />
          </div>
          
          <div>
            <h1 className="text-white font-bold">{notification.title}</h1>
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
