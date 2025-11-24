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

// --- Interfaces ---

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

// --- New UI Component for Property Selection ---

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
	// Handler to toggle selection when a row is clicked
	const handleToggle = useCallback(
		(id: string) => {
			if (selectedPropertyIds.includes(id)) {
				// Deselect: Remove id from array
				onSelectionChange(selectedPropertyIds.filter((pid) => pid !== id));
			} else {
				// Select: Add id to array
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

				// Simple price formatter
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

						{/* Visual Selection Indicator */}
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

// --- Main Component ---

export default function CreateAgentPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [properties, setProperties] = useState<Property[]>([]);
	const [agentData, setAgentData] = useState<AgentFormState>({
		name: "",
		email: "",
		assignedProperties: [],
	});

	// Fetching data from your real backend
	async function getProperties() {
		setLoading(true);
		try {
			const response = await allProperties();
			// Ensure we handle cases where response might be nested or direct
			const data = response.properties || [];
			setProperties(data);
		} catch (err) {
			console.error("Error occurred in fetching property data:", err);
			toast.error("Failed to load properties for assignment.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getProperties();
	}, []);

	// Logic: properties are unassigned if 'assignedTo' is null/undefined OR is an empty string/array
	const unassignedProperties = useMemo(() => {
		return properties.filter((p) => !p.assignedTo || p.assignedTo.length === 0);
	}, [properties]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setAgentData({ ...agentData, [name]: value });
	};

	// New handler for our custom UI list (receives array of IDs directly)
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
			router.push("/agent"); // Redirect to list
		} catch (error) {
			console.error("❌ Error creating agent:", error);
			toast.error("Failed to create agent. Check API and network.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6">
			{/* Header / Back Button Area */}
			<div className="w-full max-w-lg mb-6 flex items-center">
				<Link href={"/agent"}>
					<Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all shadow-sm flex items-center gap-2">
						<span>&larr;</span> Back
					</Button>
				</Link>
			</div>

			<Card className="w-full max-w-lg shadow-xl rounded-xl border-t-4 border-blue-600 bg-white">
				<CardHeader className="pb-2 text-center">
					<CardTitle className="text-2xl font-bold text-gray-800">
						Add New Agent
					</CardTitle>
					<p className="text-sm text-gray-500 mt-1">
						Create a profile and assign initial properties.
					</p>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Name Field */}
						<div className="space-y-1.5">
							<label
								className="text-sm font-medium text-gray-700"
								htmlFor="name">
								Full Name <span className="text-red-500">*</span>
							</label>
							<Input
								id="name"
								name="name"
								value={agentData.name}
								onChange={handleChange}
								placeholder="e.g. John Doe"
								required
								className="focus-visible:ring-blue-500"
							/>
						</div>

						{/* Email Field */}
						<div className="space-y-1.5">
							<label
								className="text-sm font-medium text-gray-700"
								htmlFor="email">
								Email Address <span className="text-red-500">*</span>
							</label>
							<Input
								id="email"
								name="email"
								type="email"
								value={agentData.email}
								onChange={handleChange}
								placeholder="john@example.com"
								required
								className="focus-visible:ring-blue-500"
							/>
						</div>

						{/* Property Assignment Section */}
						<div className="space-y-2 pt-2">
							<div className="flex justify-between items-center">
								<label
									className="text-sm font-medium text-gray-700"
									htmlFor="assignedProperties">
									Assign Properties
								</label>
								<span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
									{agentData.assignedProperties.length} selected
								</span>
							</div>

							{/* Custom Scrollable List Component */}
							<PropertyAssignmentList
								properties={unassignedProperties}
								selectedPropertyIds={agentData.assignedProperties}
								onSelectionChange={handlePropertySelectionChange}
								loading={loading}
							/>

							<p className="text-xs text-gray-400">
								Only unassigned properties are shown above.
							</p>
						</div>

						{/* Submit Action */}
						<div className="pt-4">
							<Button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 shadow-md transition-all active:scale-[0.99]"
								disabled={loading}>
								{loading ? (
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Saving Agent...
									</div>
								) : (
									"Create Agent & Assign"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
