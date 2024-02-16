import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Notifications = ({ user }) => {
  console.log(user);
  return (
    <div>
      {user.notifications.map((notification) => {
        return (
          <div className="p-4 mb-6 border-2 border-gray-300">
            <p>{notification.content.text}</p>
            <Link
              className="text-blue-900 text-decoration-underline"
              to={"/blog/" + notification.content.blogId}
            >
              Click here to see it
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
