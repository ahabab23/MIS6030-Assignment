import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Categories from "./categories";
import SearchBar from "./searchBar";
import SortBar from "./sortBar";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const pagesToShow = 3;

  useEffect(() => {
    fetch("http://127.0.0.1:5001/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        const uniqueCategories = [
          "All",
          ...new Set(data.products.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);

        // Assuming brands are included in product data
        const uniqueBrands = [
          "All Brands",
          ...new Set(data.products.map((product) => product.brand)),
        ];
        setBrands(uniqueBrands);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "All" || product.category === selectedCategory
    )
    .filter(
      (product) =>
        selectedBrand === "All Brands" || product.brand === selectedBrand
    )
    .filter((product) => product.title.toLowerCase().includes(searchQuery));

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const getPageRange = () => {
    const start = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const end = Math.min(totalPages, start + pagesToShow - 1);
    return { start, end };
  };

  const { start, end } = getPageRange();

  return (
    <div className="container px-4 py-4 max-w-sm mx-auto md:max-w-none gap-4 mb-8 w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-center uppercase">
          Products
        </h2>
        <div className="mb-4 border-b">
          <div className="text-center mb-2 border-b">
            <Categories
              categories={categories.map((cat) => ({ id: cat, name: cat }))}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-center gap-4">
            <div className="flex-shrink-0 w-full sm:w-1/4 mb-4 sm:mb-2">
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="bg-white border rounded-md p-1 w-full"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-3/4">
              <div className="flex-grow">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                />
              </div>
              <div className="flex-grow">
                <SortBar
                  sortOption={sortOption}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0 bg-blue-50 z-100 px-4 py-4 mb-0">
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
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex items-center space-x-2">
            <li>
              <button
                onClick={handlePreviousPage}
                className="px-4 py-2 border rounded-md bg-white text-blue-400"
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {start > 1 && (
              <>
                <li>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 border rounded-md bg-white text-blue-400"
                  >
                    1
                  </button>
                </li>
                {start > 2 && (
                  <li>
                    <span className="px-4 py-2 text-gray-500">...</span>
                  </li>
                )}
              </>
            )}
            {Array.from(
              { length: end - start + 1 },
              (_, index) => start + index
            ).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 border rounded-md ${
                    page === currentPage
                      ? "bg-blue-400 text-white"
                      : "bg-white text-blue-400"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
            {end < totalPages && (
              <>
                {end < totalPages - 1 && (
                  <li>
                    <span className="px-4 py-2 text-gray-500">...</span>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-4 py-2 border rounded-md bg-white text-blue-400"
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}
            <li>
              <button
                onClick={handleNextPage}
                className="px-4 py-2 border rounded-md bg-white text-blue-400"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductList;
