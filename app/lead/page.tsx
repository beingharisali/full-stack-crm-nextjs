"use client";

import React, { useEffect, useState } from "react";
import { allLead } from "@/services/lead.api";
import Link from "next/link";
import { useTokenData } from "@/lib/token";
import ProtectedRoute from "../components/ProtectRoute";

export default function LeadsPage() {
	const [leads, setLeads] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [tokenData, tokenLoading] = useTokenData();

	useEffect(() => {
		getLeads();
	}, []);

	async function getLeads() {
		setLoading(true);
		try {
			const res = await allLead();
			setLeads(res.leads || []);
		} catch (err) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Failed to fetch leads:", err);
			}
		} finally {
			setLoading(false);
		}
	}

	const filteredLeads = leads.filter((lead) => {
		const matchesSearch =
			lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lead.propertyRef?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || lead.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		const config: Record<string, { color: string; label: string; bg: string }> =
			{
				new: { color: "text-blue-700", bg: "bg-blue-100", label: "New" },
				contacted: {
					color: "text-purple-700",
					bg: "bg-purple-100",
					label: "Contacted",
				},
				qualified: {
					color: "text-green-700",
					bg: "bg-green-100",
					label: "Qualified",
				},
				converted: {
					color: "text-gray-700",
					bg: "bg-gray-200",
					label: "Converted",
				},
			};

		const current = config[status] || {
			color: "text-gray-700",
			bg: "bg-gray-200",
			label: status || "Unknown",
		};

		return (
			<span
				className={`px-3 py-1 text-xs font-medium rounded-full ${current.bg} ${current.color}`}>
				{current.label}
			</span>
		);
	};

	if (!tokenLoading && tokenData?.role !== "admin") {
		return (
			<>
				<div className="h-screen flex items-center justify-center">
					<h1 className="text-3xl font-semibold text-gray-700">
						Only Admin can access this page
					</h1>
				</div>
			</>
		);
	}

	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
						<div className="mb-4 sm:mb-0">
							<h1 className="text-3xl font-bold text-gray-900">Leads</h1>
							<p className="text-gray-600 mt-2">
								Manage and track your property inquiries
							</p>
						</div>
						<Link href="/lead/create">
							<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								New Lead
							</button>
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Total Leads</p>
									<p className="text-2xl font-bold text-gray-900 mt-1">
										{leads.length}
									</p>
								</div>
								<div className="bg-blue-100 p-3 rounded-lg">
									<svg
										className="w-6 h-6 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">New Leads</p>
									<p className="text-2xl font-bold text-gray-900 mt-1">
										{
											leads.filter(
												(lead) => !lead.status || lead.status === "new"
											).length
										}
									</p>
								</div>
								<div className="bg-green-100 p-3 rounded-lg">
									<svg
										className="w-6 h-6 text-green-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<svg
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									<input
										type="text"
										placeholder="Search leads by name, email, or property..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
									/>
								</div>
							</div>
							<div className="sm:w-48">
								<select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white">
									<option value="all">All Status</option>
									<option value="new">New</option>
									<option value="contacted">Contacted</option>
									<option value="qualified">Qualified</option>
									<option value="converted">Converted</option>
								</select>
							</div>
						</div>
					</div>

					{loading ? (
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
								<span className="ml-3 text-gray-600">Loading leads...</span>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{filteredLeads.length === 0 ? (
								<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
									<svg
										className="w-16 h-16 text-gray-400 mx-auto mb-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										No leads found
									</h3>
									<p className="text-gray-600 mb-6">
										{searchTerm || statusFilter !== "all"
											? "Try adjusting your search or filters"
											: "Get started by creating your first lead"}
									</p>
									{searchTerm || statusFilter !== "all" ? (
										<button
											onClick={() => {
												setSearchTerm("");
												setStatusFilter("all");
											}}
											className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
											Clear filters
										</button>
									) : (
										<Link href="/lead/create">
											<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
												Create New Lead
											</button>
										</Link>
									)}
								</div>
							) : (
								filteredLeads.map((lead) => (
									<div
										key={lead._id}
										className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
										<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
											<div className="flex-1">
												<div className="flex items-start justify-between mb-3">
													<div className="flex items-center gap-3">
														<div className="bg-blue-100 text-blue-800 rounded-lg p-3">
															<svg
																className="w-6 h-6"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24">
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
																/>
															</svg>
														</div>
														<div>
															<h3 className="text-lg font-semibold text-gray-900">
																{lead.name || "Unnamed Lead"}
															</h3>
															<p className="text-gray-600 text-sm mt-1">
																{lead.email}
															</p>
														</div>
													</div>
													<div className="hidden sm:block">
														{getStatusBadge(lead.status)}
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
													<div>
														<p className="text-sm text-gray-500">Message</p>
														<p className="text-gray-900 mt-1 line-clamp-2">
															{lead.message || "No message provided"}
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-500">
															Property Reference
														</p>
														<p className="text-gray-900 mt-1 font-medium">
															{lead.propertyRef || "Not specified"}
														</p>
													</div>
												</div>
											</div>

											<div className="flex items-center gap-3 mt-4 lg:mt-0 lg:ml-6">
												<button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
													<svg
														className="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
														/>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
														/>
													</svg>
												</button>
												<button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
													<svg
														className="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
												</button>
											</div>
										</div>

										<div className="sm:hidden mt-4">
											{getStatusBadge(lead.status)}
										</div>
									</div>
								))
							)}
						</div>
					)}
				</div>
			</div>
		</ProtectedRoute>
	);
}