"use client";
import React, { useEffect, useState, useMemo } from "react";
import { allProperties } from "../../services/property.api";
import { Property } from "@/types/property";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const PROPERTIES_PER_PAGE = 10;

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function getProperties() {
    setLoading(true);
    try {
      const response = await allProperties();
      console.log("property response", response);
      const data = response.properties || response.properties;
      setProperties(data);
    } catch (err) {
      console.error("Error occurred in fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProperties();
  }, []);

  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE);

  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
    const endIndex = startIndex + PROPERTIES_PER_PAGE;
    return properties.slice(startIndex, endIndex);
  }, [properties, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-xl font-semibold text-gray-500">
        Loading properties...
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center p-8 text-xl font-semibold text-gray-700">
        No properties found.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* Main content area with sidebar and properties in same row */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <div className="shrink-0">
          <Sidebar />
        </div>

        {/* Properties content on the right */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Property Listings
          </h1>

          <div className="overflow-x-auto shadow-xl rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IMAGE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By (ID)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProperties.map((property) => (
                  <tr
                    key={property._id}
                    className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      <img
                        src={property.imageURL}
                        alt="property image"
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {property.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {property.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-lg shadow-md">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}>
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
