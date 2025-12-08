"use client";
import React, { useEffect, useState, useMemo } from "react";

import { allAgents, deleteAgent, deactivateAgent, activateAgent } from "@/services/agent.api";
import { Agent } from "@/types/agent";
import { useTokenData } from "@/lib/token";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Link from "next/link";
import toast from "react-hot-toast";

const AGENTS_PER_PAGE = 10;

export default function AgentListPage() {
	const [agents, setAgents] = useState<Agent[]>([] as Agent[]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [tokenData, tokenLoading] = useTokenData();

	async function getAgents() {
		setLoading(true);
		try {
			const response = await allAgents();
			const data = response.agents || [];
			console.log(data);
			setAgents(data);
		} catch (err) {
			console.error("Error occurred in fetching agent data:", err);
			toast.error("Failed to fetch agent listings.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getAgents();
	}, []);

	const totalPages = Math.ceil(agents.length / AGENTS_PER_PAGE);

	const currentAgents = useMemo(() => {
		const startIndex = (currentPage - 1) * AGENTS_PER_PAGE;
		const endIndex = startIndex + AGENTS_PER_PAGE;
		return agents.slice(startIndex, endIndex);
	}, [agents, currentPage]);

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const deleteAgentHandler = async (id: string) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this agent? This action is irreversible."
		);
		if (isConfirmed) {
			try {
				await deleteAgent(id);
				setAgents((prevAgents) =>
					prevAgents.filter((agent) => id !== agent._id)
				);
				if (currentAgents.length === 1 && currentPage > 1) {
					setCurrentPage(currentPage - 1);
				}
				toast.success("Agent deleted successfully");
			} catch (error) {
				console.error("Error occurred in deleting agent", error);
				toast.error("Failed to delete agent");
			}
		}
	};

	const handleDeactivateAgent = async (id: string) => {
		try {
			await deactivateAgent(id);
			await getAgents();
			toast.success("Agent deactivated successfully");
		} catch (error) {
			console.error("Error deactivating agent:", error);
			toast.error("Failed to deactivate agent");
		}
	};

	const handleActivateAgent = async (id: string) => {
		try {
			await activateAgent(id);
			await getAgents();
			toast.success("Agent activated successfully");
		} catch (error) {
			console.error("Error activating agent:", error);
			toast.error("Failed to activate agent");
		}
	};

	if (tokenLoading) {
		return (
			<div className="text-center p-8 text-xl font-semibold text-gray-500">
				Verifying permissions...
			</div>
		);
	}

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

	if (loading) {
		return (
			<div className="text-center p-8 text-xl font-semibold text-gray-500">
				Loading agents...
			</div>
		);
	}

	if (agents.length === 0) {
		return (
			<>
				<Navbar />
				<div className="flex justify-between m-5">
					<h1 className="text-3xl font-bold mb-6 text-gray-800">
						Agent Listings
					</h1>
					<Link href="/agent/create">
						<button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
							Create Agent
						</button>
					</Link>
				</div>
				<div className="text-center p-8 text-xl font-semibold text-gray-700">
					No agents found.
				</div>
			</>
		);
	}

	return (
		<div className="flex">
			<div className="flex-1 flex flex-col">
				<Navbar />
				<div className="flex mx-3">
					<Sidebar />
					<div className="p-4 md:p-8 w-full md:w-[80%]">
						<div className="flex justify-between items-center mb-6">
							<h1 className="text-3xl font-bold text-gray-800">
								Agent Listings 👨‍💼
							</h1>
							<Link href="/agent/create">
								<button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
									Create Agent
								</button>
							</Link>
						</div>

						<div className="overflow-x-auto shadow-xl rounded-lg">
							<table className="min-w-full bg-white divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Email
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Assigned Properties
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{currentAgents.map((agent) => (
										<tr
											key={agent._id}
											className="hover:bg-gray-50 transition duration-150">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{agent.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{agent.email}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													agent.isActive === false
														? "bg-red-100 text-red-800"
														: "bg-green-100 text-green-800"
												}`}>
													{agent.isActive === false ? "Inactive" : "Active"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
												{/* FIX: Display the count of assigned properties */}
												{agent.assignedProperties &&
												agent.assignedProperties.length > 0
													? `${agent.assignedProperties.length} Properties assigned`
													: "None"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
												{agent.isActive === false ? (
													<button
														onClick={() => handleActivateAgent(agent._id)}
														className="text-white text-[15px] bg-green-600 rounded-md p-2 m-1 border-none cursor-pointer active:bg-green-700 hover:bg-green-500">
														Activate
													</button>
												) : (
													<button
														onClick={() => handleDeactivateAgent(agent._id)}
														className="text-white text-[15px] bg-orange-600 rounded-md p-2 m-1 border-none cursor-pointer active:bg-orange-700 hover:bg-orange-500">
														Deactivate
													</button>
												)}
												<Link href={`/agents/${agent._id}/edit`}>
													<button className="text-white text-[15px] bg-blue-700 rounded-md p-2 m-1 border-none cursor-pointer active:bg-blue-600 hover:bg-blue-500">
														Edit
													</button>
												</Link>
												<button
													onClick={() => deleteAgentHandler(agent._id)}
													className="text-white text-[15px] bg-red-600 rounded-md p-2 m-1 border-none cursor-pointer active:bg-red-600 hover:bg-red-500">
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination Controls */}
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
