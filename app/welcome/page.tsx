"use client";

import React, { useEffect, useState } from "react";
import { useTokenData } from "@/lib/token";
import Sidebar from "../components/sidebar";
import Link from "next/link";
import Navbar from "../components/navbar";
import { allProperties } from "@/services/property.api";
import { allLead } from "@/services/lead.api";
import { allAgents } from "@/services/agent.api";
import { allTransactions } from "@/services/transaction.api";
import {
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
	const [tokenData, tokenLoading] = useTokenData();
	const [loading, setLoading] = useState(true);
	const [counts, setCounts] = useState({
		leadCount: 0,
		propertyCount: 0,
		agentCount: 0,
		transactionCount: 0,
	});
	const [leadStatusData, setLeadStatusData] = useState<any[]>([]);
	const [transactionTrendData, setTransactionTrendData] = useState<any[]>([]);

	useEffect(() => {
		if (tokenLoading || tokenData?.role !== "admin") return;
		fetchDashboardData();
	}, [tokenLoading, tokenData]);

	async function fetchDashboardData() {
		setLoading(true);
		try {
			const [propsRes, leadsRes, agentsRes, transRes] = await Promise.all([
				allProperties().catch(() => ({ properties: [] })),
				allLead().catch(() => ({ leads: [] })),
				allAgents().catch(() => ({ agents: [] })),
				allTransactions().catch(() => ({ transactions: [] })),
			]);

			const properties = propsRes.properties || [];
			const leads = leadsRes.leads || [];
			const agents = agentsRes.agents || [];
			const transactions = transRes.transactions || [];

			setCounts({
				propertyCount: properties.length,
				leadCount: leads.length,
				agentCount: agents.length,
				transactionCount: transactions.length,
			});

			// Process lead status data for pie chart
			const statusCounts = leads.reduce(
				(acc: Record<string, number>, lead: any) => {
					const status = lead.status || "new";
					acc[status] = (acc[status] || 0) + 1;
					return acc;
				},
				{}
			);
			const leadData = Object.entries(statusCounts).map(([status, count]) => ({
				name: status.charAt(0).toUpperCase() + status.slice(1),
				value: count,
			}));
			setLeadStatusData(leadData);

			// Process transaction trend data for line chart (bucket by month)
			const monthCounts: Record<string, number> = {};
			transactions.forEach((t: any) => {
				const date = new Date(t.createdAt || new Date());
				const monthKey = date.toLocaleString("default", {
					year: "numeric",
					month: "short",
				});
				monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
			});
			const trendData = Object.entries(monthCounts)
				.map(([month, count]) => ({ month, transactions: count }))
				.sort((a, b) => {
					const monthOrder = [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec",
					];
					const aParts = a.month.split(" ");
					const bParts = b.month.split(" ");
					const aMonth = monthOrder.indexOf(aParts[0]);
					const bMonth = monthOrder.indexOf(bParts[0]);
					const aYear = parseInt(aParts[1]);
					const bYear = parseInt(bParts[1]);

					if (aYear !== bYear) return aYear - bYear;
					return aMonth - bMonth;
				});
			setTransactionTrendData(trendData.length > 0 ? trendData : []);
		} catch (err) {
			console.error("Failed to fetch dashboard data:", err);
		} finally {
			setLoading(false);
		}
	}

	if (tokenLoading) {
		return (
			<div className="h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!tokenData) {
		return (
			<div className="h-screen flex flex-col items-center justify-center">
				<h1 className="text-3xl font-semibold mb-4">🚫 Unauthorized</h1>
				<p className="text-gray-600">Please log in to access the dashboard.</p>
			</div>
		);
	}

	if (tokenData?.role !== "admin") {
		return (
			<div className="h-screen flex flex-col items-center justify-center">
				<h1 className="text-3xl font-semibold mb-4">🚫 Access Denied</h1>
				<p className="text-gray-600">Only admins can access the dashboard.</p>
			</div>
		);
	}

	const userName = tokenData?.firstName || "Admin";
	const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

	return (
		<div className="flex min-h-screen bg-gray-50">
			<div className="flex-1 flex flex-col">
				{/* <Navbar /> */}
				{/* Sidebar + Main */}
				<div className="flex grow">
					<Sidebar />

					<main className="flex-1 p-6 md:p-10 overflow-y-auto">
						{/* Welcome Section */}
						<section className="mb-8">
							<h1 className="text-4xl font-bold text-gray-800 mb-2">
								Welcome back, {userName}! 👋
							</h1>
							<p className="text-gray-600 text-lg">
								Here’s your CRM overview and quick access tools.
							</p>
						</section>

						{/* Summary Cards */}
						<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
							{loading ? (
								<p className="col-span-full text-center text-gray-600">
									Loading KPI data...
								</p>
							) : (
								[
									{
										label: "Total Leads",
										value: counts.leadCount,
										color: "blue",
										icon: "👥",
									},
									{
										label: "Active Properties",
										value: counts.propertyCount,
										color: "green",
										icon: "🏠",
									},
									{
										label: "Active Agents",
										value: counts.agentCount,
										color: "purple",
										icon: "👔",
									},
									{
										label: "Transactions",
										value: counts.transactionCount,
										color: "orange",
										icon: "💼",
									},
								].map((item) => (
									<div
										key={item.label}
										className={`p-6 bg-white border-t-4 border-${item.color}-500 shadow rounded-xl hover:shadow-lg transition`}>
										<div className="flex justify-between items-center mb-2">
											<span className="text-4xl">{item.icon}</span>
											<span
												className={`text-${item.color}-600 text-sm font-semibold uppercase`}>
												{item.label}
											</span>
										</div>
										<h2 className="text-3xl font-bold text-gray-800 mt-2">
											{item.value}
										</h2>
									</div>
								))
							)}
						</section>

						{/* Charts Section */}
						{!loading && (
							<section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
								{/* Leads by Status Pie Chart */}
								<div className="bg-white p-6 rounded-xl shadow">
									<h3 className="text-lg font-semibold text-gray-800 mb-4">
										📊 Leads by Status
									</h3>
									{leadStatusData.length > 0 ? (
										<ResponsiveContainer width="100%" height={300}>
											<PieChart>
												<Pie
													data={leadStatusData}
													cx="50%"
													cy="50%"
													labelLine={false}
													label={({ name, value }) => `${name}: ${value}`}
													outerRadius={80}
													fill="#8884d8"
													dataKey="value">
													{leadStatusData.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={COLORS[index % COLORS.length]}
														/>
													))}
												</Pie>
												<Tooltip />
											</PieChart>
										</ResponsiveContainer>
									) : (
										<p className="text-center text-gray-500 py-10">
											No lead data available
										</p>
									)}
								</div>

								{/* Transaction Trends Line Chart */}
								<div className="bg-white p-6 rounded-xl shadow">
									<h3 className="text-lg font-semibold text-gray-800 mb-4">
										📈 Transaction Trends
									</h3>
									{transactionTrendData.length > 0 ? (
										<ResponsiveContainer width="100%" height={300}>
											<LineChart data={transactionTrendData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="month" />
												<YAxis />
												<Tooltip />
												<Legend />
												<Line
													type="monotone"
													dataKey="transactions"
													stroke="#3B82F6"
													strokeWidth={2}
													dot={{ fill: "#3B82F6" }}
												/>
											</LineChart>
										</ResponsiveContainer>
									) : (
										<p className="text-center text-gray-500 py-10">
											No transaction data available
										</p>
									)}
								</div>
							</section>
						)}

						{/* Quick Navigation Section */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Quick Access
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{[
									{
										title: "Manage Leads",
										desc: "View and track client leads.",
										link: "/lead",
										color: "blue",
									},
									{
										title: "Properties",
										desc: "Manage property listings.",
										link: "/properties",
										color: "green",
									},
									{
										title: "Transactions",
										desc: "Track property sales and payments.",
										link: "/transactions",
										color: "purple",
									},
									{
										title: "Agents",
										desc: "View and manage team members.",
										link: "/agent",
										color: "teal",
									},
									{
										title: "Reports",
										desc: "Analyze CRM data and performance.",
										link: "/reports",
										color: "indigo",
									},
									{
										title: "Settings",
										desc: "Configure your CRM preferences.",
										link: "/profile",
										color: "gray",
									},
								].map((card) => (
									<Link
										key={card.title}
										href={card.link}
										className="block bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition">
										<div className="flex justify-between items-center mb-2">
											<h3 className="text-lg font-bold text-gray-800">
												{card.title}
											</h3>
											<span
												className={`text-${card.color}-500 text-xl font-bold`}>
												›
											</span>
										</div>
										<p className="text-gray-600 text-sm">{card.desc}</p>
									</Link>
								))}
							</div>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}
