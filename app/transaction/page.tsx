"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	createTransaction,
	updateTransaction,
	getSingleTransaction,
} from "@/services/transaction.api";
import { Transaction } from "@/types/transaction";
import ProtectedRoute from "../components/ProtectRoute";
import toast from "react-hot-toast";

interface TransactionFormProps {
	id?: string; 
}

export default function TransactionForm({ id }: TransactionFormProps) {
	const router = useRouter();

	
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false); // For initial data load
	const [error, setError] = useState<string | null>(null);

	const isEditMode = Boolean(id);

	const [formData, setFormData] = useState<Partial<Transaction>>({
		client: "",
		agent: "",
		propertyRef: "",
		price: 0,
		status: "pending",
	});

	useEffect(() => {
		if (!isEditMode || !id) return;

		const loadData = async () => {
			setFetching(true);
			try {
				const data = await getSingleTransaction(id);
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

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "price" ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (isEditMode && id) {
				await updateTransaction(id, formData);
				toast.success("Transaction updated successfully!");
			} else {
				await createTransaction(formData as Transaction);
				toast.success("Transaction created successfully!");
			}

			router.push("/transactions");
			router.refresh();
		} catch (err) {
			console.error(err);
			const errorMsg = isEditMode ? "Failed to update transaction." : "Failed to create transaction.";
			toast.error(errorMsg);
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	if (fetching) {
		return (
			<ProtectedRoute allowedRoles={["admin"]}>
				<div className="p-6 max-w-2xl mx-auto">
					<div>Loading transaction data...</div>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute allowedRoles={["admin"]}>
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
		</ProtectedRoute>
	);
}
