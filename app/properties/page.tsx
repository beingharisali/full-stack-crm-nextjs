"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	deleteProperty,
	allProperties,
	approveProperty,
	rejectProperty,
} from "@/services/property.api";
import toast from "react-hot-toast";
import { useTokenData } from "@/lib/token";
import Sidebar from "../components/sidebar";
import ProtectedRoute from "../components/ProtectRoute";
import { useAuthContext } from "../../context/AuthContext";

interface Property {
	_id: string;
	title: string;
	price: number;
	city: string;
	imageURL: string;
	status?: "approved" | "rejected" | "pending";
	createdBy: string;
}
export let propertyCount = 0;

export default function PropertiesPage() {
	const [properties, setProperties] = useState<Property[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [tokenData, tokenLoading] = useTokenData();
	const { user } = useAuthContext();
	const propertiesPerPage = 5;

	const getProperties = async () => {
		try {
			const res = await allProperties();
			if (Array.isArray(res.properties)) {
				setProperties(res.properties);
				setTotalPages(Math.ceil(res.properties.length / propertiesPerPage));
			} else {
				setProperties([]);
			}
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Error fetching properties:", error);
			}
			toast.error("Failed to load properties");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getProperties();
	}, []);

	const indexOfLastProperty = currentPage * propertiesPerPage;
	const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
	const currentProperties = properties.slice(
		indexOfFirstProperty,
		indexOfLastProperty
	);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
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
			<ProtectedRoute allowedRoles={["admin", "agent", "user"]}>
				<div className="flex justify-between m-5">
					<h1 className="text-3xl font-bold mb-6 text-gray-800">
						Property Listings
					</h1>
					<Link href="/properties/add">
						<button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
							Create Property
						</button>
					</Link>
					<div className="text-center p-8 text-xl font-semibold text-gray-700">
						No properties found.
					</div>
				</div>
			</ProtectedRoute>
		);
	}
	propertyCount = properties.length;
	console.log(propertyCount);
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
				if (process.env.NODE_ENV !== "production") {
					console.log("Error occurred in deleting property", error);
				}
				toast.error("Failed to delete property");
			}
		}
	};

	const handleApprove = async (id: string) => {
		try {
			await approveProperty(id);
			await getProperties();
			toast.success("Property approved successfully");
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Error approving property:", error);
			}
			toast.error("Failed to approve property");
		}
	};

	const handleReject = async (id: string) => {
		try {
			await rejectProperty(id);
			await getProperties();
			toast.success("Property rejected successfully");
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Error rejecting property:", error);
			}
			toast.error("Failed to reject property");
		}
	};

	return (
		<ProtectedRoute allowedRoles={["admin", "agent", "user"]}>
			<div className="flex">
				<div className="flex-1 flex flex-col">
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
													<span
														className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
													{user?.role === "admin" && (
														<>
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
														</>
													)}
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
		</ProtectedRoute>
	);
}
