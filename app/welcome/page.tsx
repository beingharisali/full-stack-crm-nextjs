"use client";

import { useTokenData } from "@/lib/token";
import Sidebar from "../components/sidebar";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectRoute";

export default function Dashboard() {
	const [tokenData, tokenLoading] = useTokenData();

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

	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<div className="flex min-h-screen bg-gray-50">
				<div className="flex-1 flex flex-col">
					<div className="flex grow">
						<Sidebar />

						<main className="flex-1 p-6 md:p-10 overflow-y-auto">
							<section className="mb-8">
								<h1 className="text-4xl font-bold text-gray-800 mb-2">
									Welcome back, {userName}! 👋
								</h1>
								<p className="text-gray-600 text-lg">
									Here’s your CRM overview and quick access tools.
								</p>
							</section>

							<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
								{[
									{
										label: "Total Leads",
										value: 243,
										color: "blue",
										icon: "👥",
									},
									{
										label: "Active Properties",
										value: 120,
										color: "green",
										icon: "🏠",
									},
									{
										label: "Closed Deals",
										value: 58,
										color: "purple",
										icon: "💼",
									},
									{
										label: "Pending Tasks",
										value: 9,
										color: "orange",
										icon: "🕓",
									},
								].map((item) => (
									<div
										key={item.label}
										className={`p-6 bg-white border-t-4 border-${item.color}-500 shadow rounded-xl`}>
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
								))}
							</section>

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
		</ProtectedRoute>
	);
}