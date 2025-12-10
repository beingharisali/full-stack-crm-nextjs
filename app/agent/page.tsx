"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	allAgents,
	deleteAgent,
	deactivateAgent,
	activateAgent,
} from "@/services/agent.api";
import toast from "react-hot-toast";
import { useTokenData } from "@/lib/token";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import ProtectedRoute from "../components/ProtectRoute";

interface Agent {
	_id: string;
	name: string;
	email: string;
	isActive?: boolean;
	assignedProperties?: any[];
}

export default function AgentsPage() {
	const [agents, setAgents] = useState<Agent[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [tokenData, tokenLoading] = useTokenData();
	const agentsPerPage = 5;

	const getAgents = async () => {
		try {
			const res = await allAgents();
			if (Array.isArray(res.agents)) {
				setAgents(res.agents);
				setTotalPages(Math.ceil(res.agents.length / agentsPerPage));
			} else {
				setAgents([]);
			}
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Error fetching agents:", error);
			}
			toast.error("Failed to load agents");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getAgents();
	}, []);

	const indexOfLastAgent = currentPage * agentsPerPage;
	const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
	const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const deleteAgentHandler = async (id: string) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this agent?"
		);
		if (isConfirmed) {
			try {
				await deleteAgent(id);
				setAgents((prevAgents) =>
					prevAgents.filter((agent) => agent._id !== id)
				);
				toast.success("Agent deleted successfully");
			} catch (error) {
				if (process.env.NODE_ENV !== "production") {
					console.error("Error deleting agent:", error);
				}
				toast.error("Failed to delete agent");
			}
		}
	};

	const handleDeactivateAgent = async (id: string) => {
		try {
			await deactivateAgent(id);
			setAgents((prevAgents) =>
				prevAgents.map((agent) =>
					agent._id === id ? { ...agent, isActive: false } : agent
				)
			);
			toast.success("Agent deactivated successfully");
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Error deactivating agent:", error);
			}
			toast.error("Failed to deactivate agent");
		}
	};

	const handleActivateAgent = async (id: string) => {
		try {
			await activateAgent(id);
			setAgents((prevAgents) =>
				prevAgents.map((agent) =>
					agent._id === id ? { ...agent, isActive: true } : agent
				)
			);
			toast.success("Agent activated successfully");
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Error activating agent:", error);
			}
			toast.error("Failed to activate agent");
		}
	};

	if (tokenLoading) {
		return (
			<>
				<Navbar />
				<div className="h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</>
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
			<>
				<Navbar />
				<p className="text-center p-8">Loading agents...</p>
			</>
		);
	}

	return (
		<ProtectedRoute allowedRoles={["admin"]}>
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