import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const WeeklyOffers = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch("http://127.0.0.1:5001/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        const products = data.products;

        if (Array.isArray(products)) {
          // Group products by category
          const categoryMap = new Map();
          products.forEach((product) => {
            if (!categoryMap.has(product.category)) {
              categoryMap.set(product.category, product);
            }
          });

          // Extract one product per category
          const uniqueCategoryProducts = Array.from(categoryMap.values());
          setTopProducts(uniqueCategoryProducts);
        } else {
          setError('Expected an array of products under "products" key');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Error fetching products: " + error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredProducts = topProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery)
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-blue-50 px-4 py-4 mb-0">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold">Explore our Weekly Offers</h2>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full max-w-md px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <hr className="my-8 border-t-2 border-gray-300" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 flex flex-col justify-between shadow-xl rounded-lg overflow-hidden bg-white aos-init"
          >
            <div className="flex-grow border border-[#e4e4e4] h-[300px] mb-4 relative overflow-hidden group transition">
              <div className="w-full h-full flex justify-center items-center">
                <div className="w-[200px] mx-auto flex justify-center items-center">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="max-h-[300px] object-cover"
                  />
                </div>
              </div>
            </div>
            <h3 className="font-medium text-sm mb-1">{product.title}</h3>
            <p className="text-gray-700 mb-2">
              Ksh.{" "}
              {Math.round(
                (product.price * (100 - product.discountPercentage)) / 100
              )}
            </p>
            <p className="text-gray-700 mb-2 line-through">
              Ksh. {product.price}
            </p>
            <div className="flex items-center space-x-6">
              {/* <button className="bg-slate-200 text-gray-600 text-sm px-2 py-2 rounded-md">
                Add to cart
              </button> */}
              <Link
                to={`/products/${product.id}`}
                className="bg-slate-200 text-gray-600 text-sm px-2 py-2 rounded-md"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyOffers;
