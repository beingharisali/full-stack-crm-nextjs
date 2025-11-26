"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	createTransaction,
	updateTransaction,
	getSingleTransaction,
} from "../../../services/transaction.api";
import { Transaction } from "../../../types/transaction";

type FormState = Omit<Partial<Transaction>, "price"> & {
	price?: number | string;
};
import { allAgents } from "@/services/agent.api";
import { allProperties } from "@/services/property.api";
import { useTokenData } from "@/lib/token";

function TransactionFormContent() {
	const [tokenData] = useTokenData();
	const router = useRouter();
	const searchParams = useSearchParams();
	const idFromQuery = searchParams?.get("id") || undefined;

	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isEditMode = Boolean(idFromQuery);
	const [formData, setFormData] = useState<FormState>({
		client: tokenData?.userId || "",
		agent: "",
		propertyRef: "",
		price: "",
		status: "pending",
	});
	const [agents, setAgents] = useState<any[]>([]);
	const [properties, setProperties] = useState<any[]>([]);

	// ensure client id is set from token once available
	useEffect(() => {
		if (tokenData?.userId) {
			setFormData((prev) => ({ ...prev, client: tokenData.userId }));
		}
	}, [tokenData]);

	// Fetch agents and properties on mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const [agentsRes, propsRes] = await Promise.all([
					allAgents(),
					allProperties(),
				]);
				setAgents(agentsRes.agents || []);
				setProperties(propsRes.properties || []);
			} catch (err) {
				console.error("Failed to load agents/properties:", err);
				setError("Failed to load form data");
			}
		};
		loadData();
	}, []);

	// Fetch transaction data if in Edit Mode
	useEffect(() => {
		if (!isEditMode || !idFromQuery) return;

		const loadData = async () => {
			setFetching(true);
			try {
				const data = await getSingleTransaction(idFromQuery);
				const t = data.transaction || ({} as any);
				// normalize populated fields to IDs
				setFormData((prev) => ({
					...prev,
					client:
						(t.client as any)?._id ||
						(t.client as any)?.id ||
						t.client ||
						prev.client ||
						"",
					agent: (t.agent as any)?._id || t.agent || "",
					propertyRef: (t.propertyRef as any)?._id || t.propertyRef || "",
					price: t.price,
					status: t.status,
				}));
			} catch (err) {
				console.error(err);
				setError("Could not load transaction details.");
			} finally {
				setFetching(false);
			}
		};

		loadData();
	}, [idFromQuery, isEditMode]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Basic client-side validation
			if (
				formData.price === "" ||
				formData.price === undefined ||
				formData.price === null
			) {
				setError("Price is required");
				setLoading(false);
				return;
			}

			const payload: Partial<Transaction> = {
				...formData,
				price:
					typeof formData.price === "string"
						? Number(formData.price)
						: (formData.price as number),
			};

			if (isEditMode && idFromQuery) {
				await updateTransaction(idFromQuery, payload);
				alert("Transaction updated successfully!");
			} else {
				await createTransaction(payload as Transaction);
				alert("Transaction created successfully!");
			}

			router.push("/transactions");
			router.refresh();
		} catch (err) {
			console.error("Submit error:", err);
			if ((err as any)?.response) {
				console.error("Server response:", (err as any).response.data);
			}
			const errMsg =
				(err as any)?.response?.data?.message ||
				(err as any)?.message ||
				(isEditMode ? "Failed to update." : "Failed to create.");
			setError(errMsg);
		} finally {
			setLoading(false);
		}
	};

	if (fetching) return <div>Loading transaction data...</div>;

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">
					{isEditMode ? "✏️ Edit Transaction" : "➕ Create New Transaction"}
				</h1>
				{isEditMode && (
					<p className="text-sm text-gray-600 mt-2">
						ID: <span className="font-mono text-xs">{idFromQuery}</span>
					</p>
				)}
			</div>

			{error && (
				<div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
					<p className="font-semibold">Error</p>
					<p>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex flex-col">
					<label className="font-semibold mb-1">Client</label>
					<input
						className="border p-2 rounded bg-gray-100"
						type="text"
						placeholder="Client name"
						value={
							tokenData
								? `${tokenData.firstName || ""} ${
										tokenData.lastName || ""
								  }`.trim()
								: ""
						}
						readOnly
						disabled
					/>
					<p className="text-xs text-gray-500 mt-1">ID: {formData.client}</p>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Agent</label>
					<select
						className="border p-2 rounded"
						name="agent"
						value={formData.agent || ""}
						onChange={handleChange}
						required>
						<option value="">Select an agent</option>
						{agents.map((agent) => (
							<option key={agent._id} value={agent._id}>
								{agent.name}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Property</label>
					<select
						className="border p-2 rounded"
						name="propertyRef"
						value={formData.propertyRef || ""}
						onChange={handleChange}
						required>
						<option value="">Select a property</option>
						{properties.map((prop) => (
							<option key={prop._id} value={prop._id}>
								{prop.title} ({prop.city})
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Price</label>
					<input
						className="border p-2 rounded"
						type="number"
						name="price"
						value={formData.price}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Status</label>
					<select
						className="border p-2 rounded"
						name="status"
						value={formData.status || "pending"}
						onChange={handleChange}>
						<option value="pending">Pending</option>
						<option value="complete">Complete</option>
						<option value="cancel">Cancel</option>
					</select>
				</div>

				<div className="flex gap-3 pt-4">
					<button
						type="submit"
						disabled={loading}
						className={`text-white px-4 py-2 rounded font-semibold transition-colors ${
							isEditMode
								? "bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
								: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
						}`}>
						{loading
							? "Processing..."
							: isEditMode
							? "💾 Update Transaction"
							: "➕ Create Transaction"}
					</button>

					<button
						type="button"
						onClick={() => router.back()}
						className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-semibold transition-colors">
						← Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default function TransactionForm() {
	return (
		<Suspense
			fallback={
				<div className="p-6 max-w-2xl mx-auto">
					<div className="text-center py-10">
						<p>Loading...</p>
					</div>
				</div>
			}>
			<TransactionFormContent />
		</Suspense>
	);
}
