"use client";

import React, { useEffect, useState, useMemo } from "react";
import { allTransactions, deleteTransaction } from "@/services/transaction.api";
import { Transaction } from "@/types/transaction";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTokenData } from "@/lib/token";

const TRANSACTIONS_PER_PAGE = 10;

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [tokenData, tokenLoading] = useTokenData();

	async function getTransactions() {
		setLoading(true);
		try {
			const response = await allTransactions();
			const data = response.transactions || [];
			setTransactions(data);
		} catch (error) {
			console.error("Error fetching transactions:", error);
			toast.error("Failed to load transactions");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getTransactions();
	}, []);

	const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);

	const currentTransactions = useMemo(() => {
		const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
		const end = start + TRANSACTIONS_PER_PAGE;
		return transactions.slice(start, end);
	}, [transactions, currentPage]);

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleDelete = async (id: string) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this transaction?"
		);
		if (!isConfirmed) return;
		try {
			await deleteTransaction(id);
			setTransactions((prev) =>
				prev.filter((t) => (t._id || (t as any).id) !== id)
			);
			toast.success("Transaction deleted successfully");
		} catch (error) {
			console.error("Failed to delete transaction:", error);
			toast.error("Failed to delete transaction");
		}
	};

	if (!tokenLoading && tokenData?.role !== "admin") {
		return (
			<>
				<Navbar />
				<div className="h-full flex items-center justify-center">
					<h1 className="text-3xl font-semibold text-gray-700">
						Only Admin can access this page
					</h1>
				</div>
			</>
		);
	}

	if (loading) {
		return (
			<div className="text-center p-8 text-xl font-semibold text-gray-500">
				Loading transactions...
			</div>
		);
	}

	if (transactions.length === 0) {
		return (
			<>
				<Navbar />
				<div className="flex justify-between m-5">
					<h1 className="text-3xl font-bold mb-6 text-gray-800">
						Transactions
					</h1>
					<Link href="/transaction">
						<button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
							New Transaction
						</button>
					</Link>
				</div>
				<div className="text-center p-8 text-xl font-semibold text-gray-700">
					No transactions found.
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
					<div className="p-4 md:p-8 w-[80%]">
						<div className="flex justify-between">
							<h1 className="text-3xl font-bold mb-6 text-gray-800">
								Transactions
							</h1>
							<Link href="/transactions/create">
								<button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
									New Transaction
								</button>
							</Link>
						</div>

						<div className="overflow-x-auto shadow-xl rounded-lg">
							<table className="min-w-full bg-white divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Property
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Agent
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Client
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Price
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Edit / Delete
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{currentTransactions.map((t) => (
										<tr
											key={t._id || (t as any).id}
											className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{typeof (t as any).propertyRef === "object"
													? (t as any).propertyRef.title || "N/A"
													: String((t as any).propertyRef)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{typeof (t as any).agent === "object"
													? (t as any).agent.name || "N/A"
													: String((t as any).agent || "-")}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{typeof (t as any).client === "object"
													? (t as any).client.firstName
														? `${(t as any).client.firstName} ${
																(t as any).client.lastName || ""
														  }`
														: (t as any).client.name || "N/A"
													: String((t as any).client || "-")}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												${t.price?.toLocaleString() || 0}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{t.status}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
												<Link
													href={`/transaction?id=${t._id || (t as any).id}`}>
													<button className="text-white text-[15px] bg-blue-700 rounded-md p-2 m-2 hover:bg-blue-500 active:bg-blue-600">
														Edit
													</button>
												</Link>
												<button
													onClick={() => handleDelete(t._id || (t as any).id)}
													className="text-white text-[15px] bg-red-600 rounded-md p-2 m-2 hover:bg-red-500 active:bg-red-600">
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
									Page <strong>{currentPage}</strong> of{" "}
									<strong>{totalPages}</strong>
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
