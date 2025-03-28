import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.svg";
import bell from "../assets/bell.svg";
import { UserContext } from "../contexts/userContext";
import emailjs from "emailjs-com";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { authToken, userEmail } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const processedIds =
          JSON.parse(localStorage.getItem("processedMessageIds")) || [];
        const response = await fetch("http://127.0.0.1:5001/admin/messages");
        if (response.ok) {
          const data = await response.json();
          const newNotifications = data.messages.filter(
            (message) => !processedIds.includes(message.id)
          );
          setNotifications(newNotifications.slice(0, 5));
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (showNotifications) {
        setShowNotifications(false); // Hide dropdown when scrolling
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showNotifications]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const closeModal = () => {
    setShowNotifications(false);
    setReplyTo(null);
  };

  const handleViewMore = (id) => {
    setExpandedNotificationId(id);
  };

  const handleViewLess = () => {
    setExpandedNotificationId(null);
  };

  const handleReplyClick = (id, email) => {
    setReplyTo({ id, email });
  };

  const handleReplyChange = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleReplySubmit = async (event) => {
    event.preventDefault();

    if (replyTo && replyMessage.trim()) {
      try {
        const templateParams = {
          to_email: replyTo.email,
          from_email: userEmail,
          message: replyMessage,
        };

        const response = await emailjs.send(
          "service_7ed26cb",
          "template_vdvc57e",
          templateParams,
          "WzSdVClszLi88tfI-"
        );

        if (response.status === 200) {
          alert("Reply sent successfully!");

          localStorage.setItem(
            "processedMessageIds",
            JSON.stringify([
              ...JSON.parse(
                localStorage.getItem("processedMessageIds") || "[]"
              ),
              replyTo.id,
            ])
          );

          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification.id !== replyTo.id
            )
          );

          setReplyTo(null);
          setReplyMessage("");
        } else {
          console.error("Failed to send reply:", response.text);
        }
      } catch (error) {
        console.error("Failed to send reply:", error);
      }
    } else {
      alert("Please provide a valid recipient email and message.");
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyMessage("");
  };

  return (
    <div className="bg-slate-100 border-b border-gray-300">
      <div className="flex flex-col sm:flex-row justify-between  h-auto sm:h-16 items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-0">
        <div className="flex-shrink-0 flex items-center mb-4 sm:mb-0">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="UrbanBazaar Logo"
              className="w-32 h-auto p-2"
            />
          </Link>
        </div>
        <div className="flex items-center gap-5 w-full sm:w-auto justify-center mt-2 sm:mt-0">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-2 py-1 border border-gray-300 rounded-md w-full sm:w-auto"
            />
            <button type="submit" className="ml-2">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-gray-700 text-lg"
              />
            </button>
          </form>
        </div>
        <div className="flex-shrink-0 flex items-center mb-4 mt-4 sm:mb-0 gap-4">
          <div className="relative flex gap-5 items-center px-2.5 pt-2.5 pb-4 min-h-[50px]">
            <img
              src={bell}
              className="object-contain self-stretch my-auto w-6 aspect-square cursor-pointer"
              alt="Notifications"
              onClick={handleBellClick}
            />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-6">
            {authToken ? (
              <Link
                to="/dashboard/dashboardAdmin"
                className="text-gray-700 hover:text-blue-700 flex items-center text-xs"
              >
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                <span className="ml-1">My Account</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-700 flex items-center text-xs"
              >
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                <span className="ml-1 text-md">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {showNotifications && (
        <div className="fixed top-16 right-5 bg-white border border-gray-300 rounded shadow-lg w-80 max-w-full z-50">
          <div className="p-4 relative max-h-96 overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg text-gray-500 font-medium mb-4">
              Notifications
            </h2>
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const isExpanded = expandedNotificationId === notification.id;
                const maxLength = 50;

                return (
                  <div key={notification.id} className="p-4 border-b">
                    <div className="flex flex-col">
                      <p className="text-md text-gray-700 fontnormal">
                        {notification.name} ({notification.email})
                      </p>
                      <p
                        onClick={() =>
                          handleReplyClick(notification.id, notification.email)
                        }
                        className="cursor-pointer font-light text-gray-700"
                      >
                        {isExpanded
                          ? notification.message
                          : notification.message.length > maxLength
                          ? `${notification.message.slice(0, maxLength)}...`
                          : notification.message}
                      </p>
                      {notification.message.length > maxLength && (
                        <button
                          onClick={() =>
                            isExpanded
                              ? handleViewLess()
                              : handleViewMore(notification.id)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          {isExpanded ? "View less" : "View more"}
                        </button>
                      )}
                      {replyTo?.id === notification.id && (
                        <div className="mt-4">
                          <textarea
                            value={replyMessage}
                            onChange={handleReplyChange}
                            placeholder="Type your reply here..."
                            rows="4"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={handleReplySubmit}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Send Reply
                            </button>
                            <button
                              onClick={handleCancelReply}
                              className="px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
