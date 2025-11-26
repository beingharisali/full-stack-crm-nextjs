"use client";

import React, { useEffect, useState } from "react";
import { allLead } from "@/services/lead.api";
import Link from "next/link";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useTokenData } from "@/lib/token";
import toast from "react-hot-toast";

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
			console.error("Failed to fetch leads:", err);
			toast.error("Failed to fetch leads");
		} finally {
			setLoading(false);
		}
	}

	// 🔍 Search + filter logic
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
				<Navbar />
				<div className="h-screen flex items-center justify-center">
					<h1 className="text-3xl font-semibold text-gray-700">
						Only Admin can access this page
					</h1>
				</div>
			</>
		);
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<div className="flex-1 flex flex-col">
				<Navbar />
				<div className="flex grow">
					<Sidebar />

					<div className="flex-1 p-8">
						{/* 🧭 Header */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
							<div>
								<h1 className="text-3xl font-bold text-gray-800">Leads</h1>
								<p className="text-gray-600 mt-1">
									Track and manage your property inquiries efficiently
								</p>
							</div>
							<Link href="/lead/create">
								<button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition">
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

						{/* 📊 Stats */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							{[
								{
									label: "Total Leads",
									value: leads.length,
									iconColor: "text-blue-600 bg-blue-100",
									icon: (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									),
								},
								{
									label: "New Leads",
									value: leads.filter((l) => !l.status || l.status === "new")
										.length,
									iconColor: "text-green-600 bg-green-100",
									icon: (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4"
										/>
									),
								},
								{
									label: "Qualified",
									value: leads.filter((l) => l.status === "qualified").length,
									iconColor: "text-yellow-600 bg-yellow-100",
									icon: (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0"
										/>
									),
								},
								{
									label: "Converted",
									value: leads.filter((l) => l.status === "converted").length,
									iconColor: "text-gray-600 bg-gray-200",
									icon: (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									),
								},
							].map((item) => (
								<div
									key={item.label}
									className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-500">{item.label}</p>
										<p className="text-2xl font-semibold text-gray-900">
											{item.value}
										</p>
									</div>
									<div className={`p-3 rounded-lg ${item.iconColor}`}>
										<svg
											className="w-6 h-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											{item.icon}
										</svg>
									</div>
								</div>
							))}
						</div>

						{/* 🔎 Filters */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row gap-4">
							<div className="relative flex-1">
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
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
								<option value="all">All Status</option>
								<option value="new">New</option>
								<option value="contacted">Contacted</option>
								<option value="qualified">Qualified</option>
								<option value="converted">Converted</option>
							</select>
						</div>

						{/* 📋 Leads List */}
						{loading ? (
							<div className="flex justify-center items-center py-10 text-gray-600">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
								Loading leads...
							</div>
						) : filteredLeads.length === 0 ? (
							<div className="bg-white p-10 rounded-xl shadow-sm border text-center text-gray-600">
								<p className="text-lg font-medium mb-2">No leads found</p>
								<p className="mb-4">
									{searchTerm || statusFilter !== "all"
										? "Try adjusting your filters"
										: "Start by adding a new lead"}
								</p>
								<Link href="/lead/create">
									<button className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition">
										Create Lead
									</button>
								</Link>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{filteredLeads.map((lead) => (
									<div
										key={lead._id}
										className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
										<div className="flex items-center justify-between mb-4">
											<div>
												<h3 className="text-lg font-semibold text-gray-900">
													{lead.name || "Unnamed Lead"}
												</h3>
												<p className="text-gray-600 text-sm">
													{lead.email || "No email"}
												</p>
											</div>
											{getStatusBadge(lead.status)}
										</div>

										<p className="text-sm text-gray-500 mb-1">Message</p>
										<p className="text-gray-800 mb-3 line-clamp-2">
											{lead.message || "No message provided"}
										</p>

										<p className="text-sm text-gray-500 mb-1">Property Ref</p>
										<p className="text-gray-800 font-medium">
											{lead.propertyRef || "Not specified"}
										</p>

										<div className="flex gap-3 mt-5">
											<button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
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
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7"
													/>
												</svg>
												View
											</button>
											<Link href={`/lead/create?id=${lead._id}`}>
												<button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
													<svg
														className="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11"
														/>
													</svg>
													Edit
												</button>
											</Link>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
