import React, { useState, useEffect } from "react";
import { useApiRequest } from "../../../hooks/useApiRequest";
import ProductCard from "./ProductCard";
import { BASE_URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const [activeFilter, setActiveFilter] = useState("active");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const {
    data: userProducts,
    loading: productsLoading,
    error: productsError,
    makeRequest: fetchUserProducts,
  } = useApiRequest();

  useEffect(() => {
    if (userId) {
      fetchUserProducts({
        url: `${BASE_URL}user-products?user_id=${userId}`,
        method: "GET",
      });
    }
  }, [activeFilter, userId, fetchUserProducts]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleEdit = (productId) => {
    // productId is the 'id' field from the API response, e.g., 1, 3, 6, 10
    navigate(`/edit-product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">My Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => handleFilterChange("active")}
            className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
              activeFilter === "active"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Active</span>
              <span className="text-sm mt-1">View active listings</span>
            </div>
          </button>
          <button
            onClick={() => handleFilterChange("hidden")}
            className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
              activeFilter === "hidden"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Hidden</span>
              <span className="text-sm mt-1">View hidden listings</span>
            </div>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}{" "}
            Listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeFilter === "active" && (
              <>
                {productsLoading && <p className="text-gray-500">Loading...</p>}
                {productsError && (
                  <p className="text-red-500">{productsError}</p>
                )}
                {!productsLoading &&
                  !productsError &&
                  userProducts &&
                  Array.isArray(userProducts) &&
                  userProducts.length === 0 && (
                    <p className="text-gray-500 col-span-full">
                      No active listings found.
                    </p>
                  )}
                {!productsLoading &&
                  !productsError &&
                  userProducts &&
                  Array.isArray(userProducts) &&
                  userProducts.length > 0 &&
                  userProducts
                    .filter((product) => product.status === 1)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        title={product.title}
                        image={product.mediafiles?.[0]?.file_path}
                        status={"Active"}
                        description={product.description}
                        price={product.price}
                        location={product.location}
                        category={product.category?.name}
                        condition={product.condition?.name}
                        creator={product.created_by_id}
                        mediafiles={product.mediafiles}
                        showMenu={true}
                        isHidden={false}
                        onHide={async () => {
                          await fetch(
                            `${BASE_URL}listings/${product.id}/update-status`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ status: 4 }),
                            }
                          );
                          fetchUserProducts({
                            url: `${BASE_URL}user-products?user_id=${userId}`,
                            method: "GET",
                          });
                        }}
                      />
                    ))}
              </>
            )}
            {activeFilter === "hidden" && (
              <>
                {productsLoading && <p className="text-gray-500">Loading...</p>}
                {productsError && (
                  <p className="text-red-500">{productsError}</p>
                )}
                {!productsLoading &&
                  !productsError &&
                  userProducts &&
                  Array.isArray(userProducts) &&
                  userProducts.filter((product) => product.status === 4)
                    .length === 0 && (
                    <p className="text-gray-500 col-span-full">
                      No hidden listings found.
                    </p>
                  )}
                {!productsLoading &&
                  !productsError &&
                  userProducts &&
                  Array.isArray(userProducts) &&
                  userProducts.filter((product) => product.status === 4)
                    .length > 0 &&
                  userProducts
                    .filter((product) => product.status === 4)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        title={product.title}
                        image={product.mediafiles?.[0]?.file_path}
                        status={"Hidden"}
                        description={product.description}
                        price={product.price}
                        location={product.location}
                        category={product.category?.name}
                        condition={product.condition?.name}
                        creator={product.created_by_id}
                        mediafiles={product.mediafiles}
                        showMenu={true}
                        isHidden={true}
                        onUnhide={async () => {
                          await fetch(
                            `${BASE_URL}listings/${product.id}/update-status`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ status: 1 }),
                            }
                          );
                          fetchUserProducts({
                            url: `${BASE_URL}user-products?user_id=${userId}`,
                            method: "GET",
                          });
                        }}
                      />
                    ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListings;
