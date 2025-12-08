"use client";
import React, { useEffect, useState, useMemo } from "react";
import { allProperties, deleteProperty, approveProperty, rejectProperty } from "../../services/property.api";
import { Property } from "@/types/property";
import { useTokenData } from "@/lib/token";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Link from "next/link";
import toast from "react-hot-toast";
const PROPERTIES_PER_PAGE = 10;

export default function Page() {
	const [properties, setProperties] = useState<Property[]>([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [tokenData, tokenLoading] = useTokenData();
	console.log(loading, properties, tokenData, tokenLoading);

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

	const handleApprove = async (id: string) => {
		try {
			await approveProperty(id);
			await getProperties();
			toast.success("Property approved successfully");
		} catch (error) {
			console.error("Error approving property:", error);
			toast.error("Failed to approve property");
		}
	};

	const handleReject = async (id: string) => {
		try {
			await rejectProperty(id);
			await getProperties();
			toast.success("Property rejected successfully");
		} catch (error) {
			console.error("Error rejecting property:", error);
			toast.error("Failed to reject property");
		}
	};

	if (tokenLoading === false) {
		if (tokenData?.role !== "admin") {
			return (
				<>
					<Navbar />
					<div className="h-full flex items-center justify-center ">
						<h1 className="text-3xl">Only Admin can access this page</h1>
					</div>
				</>
			);
		}
	}
	if (loading) {
		return (
			<div className="text-center p-8 text-xl font-semibold text-gray-500">
				Loading properties...
			</div>
		);
	}

	if (properties.length === 0) {
		return (
			<>
				<Navbar />
				<div className="flex justify-between m-5">
					<h1 className="text-3xl font-bold mb-6 text-gray-800">
						Property Listings
					</h1>
					<Link href="/properties/add">
						<button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
							Create Property
						</button>
					</Link>
				</div>
				<div className="text-center p-8 text-xl font-semibold text-gray-700">
					No properties found.
				</div>
			</>
		);
	}
	const deleteProp = async (id: string) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete your property?"
		);
		if (isConfirmed) {
			try {
				await deleteProperty(id);
				setProperties((prevProperties) =>
					prevProperties.filter((property) => id !== property._id)
				);
				toast.success("Property deleted successfully");
			} catch (error) {
				console.log("Error occurred in deleting property", error);
				toast.error("Failed to delete property");
			}
		}
	};

	return (
		<div className="flex">
			<div className="flex-1 flex flex-col">
				<Navbar />
				<div className="flex mx-3">
					<Sidebar />
					<div className="p-4 md:p-8 w-[80%]">
						<div className="flex justify-between">
							<h1 className="text-3xl font-bold mb-6 text-gray-800">
								Property Listings
							</h1>
							<Link href="/properties/add">
								<button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
									Create Property
								</button>
							</Link>
						</div>

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
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Created By (ID)
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
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
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													property.status === "approved"
														? "bg-green-100 text-green-800"
														: property.status === "rejected"
														? "bg-red-100 text-red-800"
														: "bg-yellow-100 text-yellow-800"
												}`}>
													{property.status || "pending"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
												{property.createdBy}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
												{property.status === "pending" && (
													<>
														<button
															onClick={() => handleApprove(property._id)}
															className="text-white text-[15px] bg-green-600 rounded-md p-2 m-1 border-none cursor-pointer active:bg-green-700 hover:bg-green-500">
															Approve
														</button>
														<button
															onClick={() => handleReject(property._id)}
															className="text-white text-[15px] bg-red-600 rounded-md p-2 m-1 border-none cursor-pointer active:bg-red-700 hover:bg-red-500">
															Reject
														</button>
													</>
												)}
												<Link href={`/properties/${property._id}/edit`}>
													<button className="text-white text-[15px] bg-blue-700 rounded-md p-2 m-1 border-none	cursor-pointer active:bg-blue-600 hover:bg-blue-500">
														Edit
													</button>
												</Link>
												<button
													onClick={() => {
														deleteProp(property._id);
													}}
													className="text-white text-[15px] bg-red-600 rounded-md p-2 m-1 border-none	cursor-pointer active:bg-red-600 hover:bg-red-500">
													Delete
												</button>
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
									Page **{currentPage}** of **{totalPages}**
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
		</div>
	);
}
