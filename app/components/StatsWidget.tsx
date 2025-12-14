"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions,
} from "chart.js";
import { allProperties } from "@/services/property.api";
import { allLead } from "@/services/lead.api";
import { allAgents } from "@/services/agent.api";
import { allTransactions } from "@/services/transaction.api";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface Stats {
	propertyCount: number;
	leadCount: number;
	agentCount: number;
	transactionCount: number;
}

interface StatsWidgetProps {
	layout?: "horizontal" | "vertical";
	showLabels?: boolean;
	compact?: boolean;
	showChart?: boolean;
}

export default function StatsWidget({
	layout = "horizontal",
	showLabels = true,
	compact = false,
	showChart = true,
}: StatsWidgetProps) {
	const [stats, setStats] = useState<Stats>({
		propertyCount: 0,
		leadCount: 0,
		agentCount: 0,
		transactionCount: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchStats();
	}, []);

	async function fetchStats() {
		setLoading(true);
		try {
			const [propsRes, leadsRes, agentsRes, transRes] = await Promise.all([
				allProperties().catch(() => ({ properties: [] })),
				allLead().catch(() => ({ leads: [] })),
				allAgents().catch(() => ({ agents: [] })),
				allTransactions().catch(() => ({ transactions: [] })),
			]);

			setStats({
				propertyCount: propsRes.properties?.length || 0,
				leadCount: leadsRes.leads?.length || 0,
				agentCount: agentsRes.agents?.length || 0,
				transactionCount: transRes.transactions?.length || 0,
			});
		} catch (err) {
			console.error("Failed to fetch stats:", err);
		} finally {
			setLoading(false);
		}
	}

	const statsData = [
		{
			label: "Properties",
			value: stats.propertyCount,
			icon: "🏠",
			color: "bg-green-100 text-green-700",
		},
		{
			label: "Leads",
			value: stats.leadCount,
			icon: "👥",
			color: "bg-blue-100 text-blue-700",
		},
		{
			label: "Agents",
			value: stats.agentCount,
			icon: "👔",
			color: "bg-purple-100 text-purple-700",
		},
		{
			label: "Transactions",
			value: stats.transactionCount,
			icon: "💼",
			color: "bg-orange-100 text-orange-700",
		},
	];

	const chartOptions: ChartOptions<"bar"> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: "rgba(255, 255, 255, 0.9)",
				titleColor: "#333",
				bodyColor: "#666",
				borderColor: "#e5e7eb",
				borderWidth: 1,
				cornerRadius: 6,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: "#f3f4f6",
				},
				ticks: {
					color: "#6b7280",
				},
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					color: "#6b7280",
					font: {
						size: 14,
					},
				},
			},
		},
	};

	const chartData = {
		labels: statsData.map((stat) => stat.label),
		datasets: [
			{
				label: "Count",
				data: statsData.map((stat) => stat.value),
				backgroundColor: [
					"rgba(34, 197, 94, 0.8)",
					"rgba(59, 130, 246, 0.8)",
					"rgba(168, 85, 247, 0.8)",
					"rgba(249, 115, 22, 0.8)",
				],
				borderColor: [
					"rgb(34, 197, 94)",
					"rgb(59, 130, 246)",
					"rgb(168, 85, 247)",
					"rgb(249, 115, 22)",
				],
				borderWidth: 2,
				borderRadius: 8,
				hoverBackgroundColor: [
					"rgba(34, 197, 94, 1)",
					"rgba(59, 130, 246, 1)",
					"rgba(168, 85, 247, 1)",
					"rgba(249, 115, 22, 1)",
				],
			},
		],
	};

	if (loading) {
		return (
			<div className="flex flex-col gap-6 p-4">
				<div
					className={`flex ${
						layout === "horizontal" ? "flex-row gap-4" : "flex-col gap-4"
					} p-2`}>
					{statsData.map((_, idx) => (
						<div
							key={idx}
							className={`${
								compact ? "h-10 w-24" : "h-30 w-70"
							} bg-gray-200 rounded-lg animate-pulse`}
						/>
					))}
				</div>
				{showChart && (
					<div className="h-80 w-full bg-gray-200 rounded-xl animate-pulse p-4 flex items-center justify-center">
						<p className="text-gray-500">Loading chart...</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
			<div
				className={`flex ${
					layout === "horizontal" ? "flex-row gap-4" : "flex-col gap-4"
				} p-2`}>
				{statsData.map((stat) => (
					<div
						key={stat.label}
						className={`${stat.color} ${
							compact
								? "p-2 rounded text-xs h-10 w-24"
								: "p-4 rounded-lg h-30 w-68"
						} flex items-center ${
							layout === "vertical" ? "justify-start" : "justify-center"
						} gap-4`}>
						<span className={compact ? "text-xl" : "text-5xl"}>
							{stat.icon}
						</span>

						<div className="flex flex-col">
							<span
								className={`font-extrabold ${
									compact ? "text-lg" : "text-4xl"
								}`}>
								{stat.value}
							</span>

							{showLabels && (
								<span
									className={`opacity-75 ${compact ? "text-sm" : "text-base"}`}>
									{stat.label}
								</span>
							)}
						</div>
					</div>
				))}
			</div>

			{showChart && (
				<div className="bg-white p-4 rounded-xl shadow-md w-full">
					<h3 className="text-lg font-semibold text-gray-800 mb-3">
						Metrics Overview
					</h3>
					<div className="h-64 w-full">
						<Bar options={chartOptions} data={chartData} />
					</div>
				</div>
			)}
		</div>
	);
}
