import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { useCart } from "../contexts/cartContext";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, setWishlist, setLoading } =
    useCart();
  const { authToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const fetchWishlistData = async () => {
      const token = authToken || localStorage.getItem("access_token");
      if (!token) {
        console.error("No auth token available");
        return;
      }
      setLoading(true);
      try {
        console.log("Fetching wishlist data...");
        const response = await fetch("http://127.0.0.1:5001/wishlist", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Wishlist fetch response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          throw new Error(errorData.msg || "Failed to fetch wishlist data");
        }
        const data = await response.json();
        console.log("Wishlist data fetched:", data);
        setWishlist(data.wishlist || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchWishlistData();
    } else {
      setLoading(false);
    }

    return () => {
      setLoading(false);
    };
  }, [authToken, setWishlist, setLoading]);

  if (loading) return <p>Loading...</p>;

  if (!authToken) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
        <div className="bg-white rounded-lg w-full max-w-sm p-6">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">You need to log in</h3>
            <p className="text-center mb-4">
              Please log in to view and manage your wishlist.
            </p>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <button
                className="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 text-center"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-center"
                onClick={() => navigate("/")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const closeModal = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const continueShopping = () => {
    navigate(-1);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="sticky top-0 bg-white pb-5 pt-4 px-4 sm:px-6">
                <div className="flex justify-between items-center border-b border-t border-gray-200 pb-4 pt-4">
                  <h3 className="text-lg sm:text-xl font-semibold">Wishlist</h3>
                  <button
                    className="text-gray-500 hover:text-gray-600 focus:outline-none"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
              {wishlist.length === 0 ? (
                <p className="text-center mt-4">Your wishlist is empty.</p>
              ) : (
                // <div>
                //   <table className="min-w-full divide-y divide-gray-200">
                //     <thead className="bg-gray-50">
                //       <tr>
                //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                //         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                //       </tr>
                //     </thead>
                //     <tbody className="bg-white divide-y divide-gray-200">
                //       {wishlist.map((item, i) => (
                //         <tr key={i}>
                //           <td className="px-6 py-4 whitespace-nowrap flex items-center">
                //             <img
                //               src={item.image}
                //               alt={item.title}
                //               className="w-16 h-16 object-cover mr-4"
                //             />
                //             <div>
                //               <h4 className="text-sm font-medium">{item.title}</h4>
                //             </div>
                //           </td>
                //           <td className="px-6 py-4 whitespace-nowrap">
                //             Ksh {Math.round((item.price * (100 - item.discount_percentage)) / 100).toLocaleString()}
                //           </td>
                //           <td className="px-6 py-4 whitespace-nowrap">
                //             <button
                //               className="text-red-600 hover:text-red-800"
                //               onClick={() => removeFromWishlist(item.id)}
                //             >
                //               <svg
                //                 xmlns="http://www.w3.org/2000/svg"
                //                 fill="none"
                //                 viewBox="0 0 24 24"
                //                 stroke="currentColor"
                //                 className="w-6 h-6"
                //               >
                //                 <path
                //                   strokeLinecap="round"
                //                   strokeLinejoin="round"
                //                   strokeWidth={2}
                //                   d="M6 18L18 6M6 6l12 12"
                //                 />
                //               </svg>
                //             </button>
                //           </td>
                //         </tr>
                //       ))}
                //     </tbody>
                //   </table>
                // </div>
                <div>
                  {/* Desktop View (Table) */}
                  <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {wishlist.map((item, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-16 h-16 object-cover mr-4"
                              />
                              <div>
                                <h4 className="text-sm font-medium">
                                  {item.title}
                                </h4>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Ksh{" "}
                              {Math.round(
                                (item.price *
                                  (100 - item.discount_percentage)) /
                                  100
                              ).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View (Cards) */}
                  <div className="block md:hidden">
                    {wishlist.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white border rounded-md shadow-sm mb-4 p-4"
                      >
                        <div className="flex items-center mb-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover mr-4"
                          />
                          <div>
                            <h4 className="text-sm font-medium">
                              {item.title}
                            </h4>
                            <p className="text-gray-600">
                              Ksh{" "}
                              {Math.round(
                                (item.price *
                                  (100 - item.discount_percentage)) /
                                  100
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                <button
                  className="bg-gray-300 hover:bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={continueShopping}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
