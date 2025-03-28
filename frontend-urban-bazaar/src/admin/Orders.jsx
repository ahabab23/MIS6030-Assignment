import React, { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetch("http://127.0.0.1:5001/order")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-4 mt-10">
      {/* <div className="text-2xl font-bold text-gray-800 mb-4">Orders</div> */}
      <div className="max-w-sm mx-auto md:max-w-none gap-4 mb-8 w-full">
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Id
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipping Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.id}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_id}</td> */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.shipping_address}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.payment_method}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    Ksh {Math.round(order.order_total)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="block md:hidden">
            {currentOrders.length ? (
              currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-b p-4 flex flex-col space-y-2"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-600">
                      Id:
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      {order.id}
                    </span>
                  </div>
                  {/* <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-600">Customer:</span>
                    <span className="text-sm text-gray-600 mb-2">{order.user_id}</span>
                  </div> */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-600">
                      Order Date:{" "}
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      {new Date(order.order_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-600">
                      Shipping Address:{" "}
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      {order.shipping_address}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-600">
                      Payment Method:{" "}
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      {order.payment_method}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-600">
                      Amount:{" "}
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      Ksh {order.order_total}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-600">
                      Status:{" "}
                    </span>
                    <span className="text-sm text-gray-600 mb-2">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">No orders found</div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstOrder + 1} to {indexOfLastOrder} of{" "}
              {orders.length} entries
            </span>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? "bg-neutral-300" : "bg-neutral-100"
                }`}
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[...Array(totalPages).keys()].map((number) => (
                <button
                  key={number + 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === number + 1
                      ? "text-white bg-indigo-600"
                      : "bg-neutral-100"
                  }`}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-neutral-300"
                    : "bg-neutral-100"
                }`}
                onClick={() =>
                  currentPage < totalPages && paginate(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
