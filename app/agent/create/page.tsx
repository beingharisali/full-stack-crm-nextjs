"use client";

import { createAgent } from "@/services/agent.api";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { allProperties } from "@/services/property.api";
import ProtectedRoute from "../../components/ProtectRoute";


interface AgentFormState {
	name: string;
	email: string;
	assignedProperties: string[];
}

export interface Property {
	title: string;
	price: number;
	city: string;
	createdBy: string;
	desc: string;
	imageURL: string;
	_id: string;
	imageFile: null;
	assignedTo: string | null;
}


interface PropertyAssignmentListProps {
	properties: Property[];
	selectedPropertyIds: string[];
	onSelectionChange: (ids: string[]) => void;
	loading: boolean;
}

const PropertyAssignmentList: React.FC<PropertyAssignmentListProps> = ({
	properties,
	selectedPropertyIds,
	onSelectionChange,
	loading,
}) => {
	const handleToggle = useCallback(
		(id: string) => {
			if (selectedPropertyIds.includes(id)) {
				onSelectionChange(selectedPropertyIds.filter((pid) => pid !== id));
			} else {
				onSelectionChange([...selectedPropertyIds, id]);
			}
		},
		[selectedPropertyIds, onSelectionChange]
	);

	if (loading) {
		return (
			<div className="text-sm text-gray-500 flex flex-col items-center justify-center h-48 border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4">
				<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
				Loading properties...
			</div>
		);
	}

	if (properties.length === 0) {
		return (
			<div className="text-sm text-center text-gray-500 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
				<p>No unassigned properties found.</p>
				<p className="text-xs mt-1">
					All properties are currently assigned to other agents.
				</p>
			</div>
		);
	}

	return (
		<div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto shadow-sm bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
			{properties.map((property) => {
				const isSelected = selectedPropertyIds.includes(property._id);

				const priceFormatted = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}).format(property.price);

				return (
					<div
						key={property._id}
						onClick={() => handleToggle(property._id)}
						className={`
                            flex justify-between items-center p-3 border-b last:border-b-0 cursor-pointer transition-colors duration-150
                            ${
															isSelected
																? "bg-blue-50 border-blue-100"
																: "hover:bg-gray-50 border-gray-100"
														}
                        `}>
						<div className="flex flex-col">
							<span
								className={`font-medium text-sm ${
									isSelected ? "text-blue-700" : "text-gray-800"
								}`}>
								{property.title}
							</span>
							<span className="text-xs text-gray-500">
								{property.city} • {priceFormatted}
							</span>
						</div>

						<div
							className={`h-5 w-5 rounded border flex items-center justify-center transition-all duration-200 ${
								isSelected
									? "bg-blue-600 border-blue-600"
									: "border-gray-300 bg-white"
							}`}>
							{isSelected && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5 text-white"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};


export default function CreateAgentPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [properties, setProperties] = useState<Property[]>([]);
	const [agentData, setAgentData] = useState<AgentFormState>({
		name: "",
		email: "",
		assignedProperties: [],
	});

	async function getProperties() {
		setLoading(true);
		try {
			const response = await allProperties();
			const data = response.properties || [];
			setProperties(data);
		} catch (err) {
			if (process.env.NODE_ENV !== "production") {
				console.error("Error occurred in fetching property data:", err);
			}
			toast.error("Failed to load properties for assignment.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getProperties();
	}, []);

	const unassignedProperties = useMemo(() => {
		return properties.filter((p) => !p.assignedTo || p.assignedTo.length === 0);
	}, [properties]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setAgentData({ ...agentData, [name]: value });
	};

	const handlePropertySelectionChange = (selectedIds: string[]) => {
		setAgentData((prev) => ({
			...prev,
			assignedProperties: selectedIds,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const formData = {
			name: agentData.name,
			email: agentData.email,
			assignedProperties: agentData.assignedProperties,
		};

		try {
			await createAgent(formData);

			toast.success("Agent created successfully and properties assigned!");
			router.push("/agent"); 
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.error("❌ Error creating agent:", error);
			}
			toast.error("Failed to create agent. Check API and network.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-4xl mx-auto px-4">
					<Link href={"/agent"}>
						<button className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
							</svg>
							Back to Agents
						</button>
					</Link>
					
					<Card className="shadow-lg rounded-2xl border-0 overflow-hidden">
						<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
							<h1 className="text-2xl font-bold text-white">Add New Agent</h1>
							<p className="text-blue-100 mt-1">Create a profile and assign initial properties</p>
						</div>
						
						<CardContent className="p-6">
							{loading ? (
								<div className="flex flex-col items-center justify-center py-12">
									<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
									<p className="text-gray-600 font-medium">Creating agent profile...</p>
									<p className="text-gray-500 text-sm mt-1">Please wait while we process your request</p>
								</div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Full Name <span className="text-red-500">*</span>
											</label>
											<Input
												name="name"
												value={agentData.name}
												onChange={handleChange}
												placeholder="e.g. John Doe"
												required
												className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Email Address <span className="text-red-500">*</span>
											</label>
											<Input
												name="email"
												type="email"
												value={agentData.email}
												onChange={handleChange}
												placeholder="john@example.com"
												required
												className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
											/>
										</div>
									</div>

									<div>
										<div className="flex justify-between items-center mb-2">
											<label className="block text-sm font-medium text-gray-700">
												Assign Properties
											</label>
											<span className="inline-flex items-center text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
												{agentData.assignedProperties.length} selected
											</span>
										</div>

										<PropertyAssignmentList
											properties={unassignedProperties}
											selectedPropertyIds={agentData.assignedProperties}
											onSelectionChange={handlePropertySelectionChange}
											loading={loading}
										/>

										<p className="text-xs text-gray-500 mt-2">
											Only unassigned properties are shown above.
										</p>
									</div>

									<div className="flex justify-end pt-4">
										<Button
											type="submit"
											className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
											disabled={loading}>
											{loading ? (
												<span className="flex items-center">
													<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
													</svg>
													Creating Agent...
												</span>
											) : (
												"Create Agent & Assign"
											)}
										</Button>
									</div>
								</form>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</ProtectedRoute>
	);
}