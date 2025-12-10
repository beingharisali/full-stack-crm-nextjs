"use client";
import React, { useEffect, useState, useMemo } from "react";
import { allProperties } from "../../../services/property.api";
import { Property } from "@/types/property";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Link from "next/link";

const PROPERTIES_PER_PAGE = 6;

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
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600 font-medium">Loading properties...</p>
				</div>
			</div>
		);
	}

	if (properties.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="flex justify-between items-center mb-8">
						<h1 className="text-3xl font-bold text-gray-800">
							Property Listings
						</h1>
						<Link href="/properties/add">
							<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
								Create Property
							</button>
						</Link>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
						<svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No properties found
						</h3>
						<p className="text-gray-600 mb-6">
							No properties have been created by the Admin yet.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="flex">
				<Sidebar />
				<div className="flex-1 p-4 md:p-8">
					<div className="max-w-7xl mx-auto">
						<div className="flex justify-between items-center mb-8">
							<h1 className="text-3xl font-bold text-gray-800">
								Property Listings
							</h1>
							<Link href="/properties/add">
								<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
									Create Property
								</button>
							</Link>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
							{currentProperties.map((property) => (
								<div key={property._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
									<div className="h-48 overflow-hidden">
										<img
											src={property.imageURL}
											alt={property.title}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="p-6">
										<div className="flex justify-between items-start mb-2">
											<h3 className="text-lg font-bold text-gray-900 truncate">
												{property.title}
											</h3>
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												{property.city}
											</span>
										</div>
										
										<p className="text-2xl font-bold text-gray-900 mb-3">
											${property.price?.toLocaleString()}
										</p>
										
										<p className="text-gray-600 text-sm mb-4 line-clamp-2">
											{property.desc}
										</p>
										
										<div className="flex justify-between items-center text-xs text-gray-500">
											<span>Created by: {property.createdBy}</span>
											{property.assignedTo && (
												<span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
													Assigned
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{totalPages > 1 && (
							<div className="flex justify-between items-center bg-white rounded-lg shadow-sm border border-gray-200 p-4">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${
										currentPage === 1
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}>
									Previous
								</button>

								<div className="flex space-x-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
										<button
											key={page}
											onClick={() => handlePageChange(page)}
											className={`w-8 h-8 text-sm rounded-full transition-colors ${
												currentPage === page
													? "bg-blue-600 text-white"
													: "bg-gray-100 text-gray-700 hover:bg-gray-200"
											}`}>
											{page}
										</button>
									))}
								</div>

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ${
										currentPage === totalPages
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}>
									Next
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}