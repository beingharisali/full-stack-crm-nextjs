"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	createTransaction,
	updateTransaction,
	getSingleTransaction,
} from "@/services/transaction.api";
import { Transaction } from "@/types/transaction";

interface TransactionFormProps {
	id?: string; // Optional: If provided, form acts as "Edit"
}

export default function TransactionForm({ id }: TransactionFormProps) {
	const router = useRouter();

	// State
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false); // For initial data load
	const [error, setError] = useState<string | null>(null);

	// Determine if we are in Edit Mode based on the presence of 'id'
	const isEditMode = Boolean(id);

	const [formData, setFormData] = useState<Partial<Transaction>>({
		client: "",
		agent: "",
		propertyRef: "",
		price: 0,
		status: "pending",
	});

	// EFFECT: Fetch data if in Edit Mode
	useEffect(() => {
		if (!isEditMode || !id) return;

		const loadData = async () => {
			setFetching(true);
			try {
				const data = await getSingleTransaction(id);
				// Ensure we set the form data correctly based on your API response structure
				setFormData(data.transaction);
			} catch (err) {
				console.error(err);
				setError("Could not load transaction details.");
			} finally {
				setFetching(false);
			}
		};

		loadData();
	}, [id, isEditMode]);

	// HANDLER: Input changes
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "price" ? Number(value) : value,
		}));
	};

	// HANDLER: Form Submit (Switches logic based on mode)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (isEditMode && id) {
				// --- UPDATE LOGIC ---
				await updateTransaction(id, formData);
				alert("Transaction updated successfully!");
			} else {
				// --- CREATE LOGIC ---
				await createTransaction(formData as Transaction);
				alert("Transaction created successfully!");
			}

			router.push("/transactions");
			router.refresh();
		} catch (err) {
			console.error(err);
			setError(isEditMode ? "Failed to update." : "Failed to create.");
		} finally {
			setLoading(false);
		}
	};

	// Render a loading state while fetching initial data for edit
	if (fetching) return <div>Loading transaction data...</div>;

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">
				{isEditMode ? "Edit Transaction" : "Create New Transaction"}
			</h1>

			{error && (
				<div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex flex-col">
					<label className="font-semibold mb-1">Client Name</label>
					<input
						className="border p-2 rounded"
						type="text"
						name="client"
						value={formData.client || ""}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Agent Name</label>
					<input
						className="border p-2 rounded"
						type="text"
						name="agent"
						value={formData.agent || ""}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Property Reference</label>
					<input
						className="border p-2 rounded"
						type="text"
						name="propertyRef"
						value={formData.propertyRef || ""}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Price</label>
					<input
						className="border p-2 rounded"
						type="number"
						name="price"
						value={formData.price || 0}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col">
					<label className="font-semibold mb-1">Status</label>
					<select
						className="border p-2 rounded"
						name="status"
						value={formData.status}
						onChange={handleChange}>
						<option value="pending">Pending</option>
						<option value="complete">Complete</option>
						<option value="closed">Closed</option>
					</select>
				</div>

				<div className="flex gap-3 pt-4">
					<button
						type="submit"
						disabled={loading}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
						{loading
							? "Processing..."
							: isEditMode
							? "Update Transaction"
							: "Create Transaction"}
					</button>

					<button
						type="button"
						onClick={() => router.back()}
						className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
