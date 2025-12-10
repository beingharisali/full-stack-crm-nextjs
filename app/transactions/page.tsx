"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { allTransactions, deleteTransaction } from "@/services/transaction.api";
import { Transaction } from "@/types/transaction";

import Sidebar from "../components/sidebar";
import ProtectedRoute from "../components/ProtectRoute";

const TRANSACTIONS_PER_PAGE = 10;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getTransactions = async () => {
    setLoading(true);
    try {
      const response = await allTransactions();
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);

  const currentTransactions = useMemo(() => {
    const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    return transactions.slice(start, start + TRANSACTIONS_PER_PAGE);
  }, [transactions, currentPage]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;

    try {
      await deleteTransaction(id);
      setTransactions((prev) =>
        prev.filter((t) => (t._id || (t as any).id) !== id)
      );
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <Sidebar />

          <div className="flex-1 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Transactions
              </h1>

              <Link href="/transactions/create">
                <button className="p-3 text-[18px] rounded-xl bg-blue-700 text-white hover:bg-blue-800">
                  New Transaction
                </button>
              </Link>
            </div>

            {loading && (
              <div className="text-center p-8 text-xl font-semibold text-gray-500">
                Loading transactions...
              </div>
            )}

            {!loading && transactions.length === 0 && (
              <div className="text-center p-8 text-xl font-semibold text-gray-700">
                No transactions found.
              </div>
            )}

            {!loading && transactions.length > 0 && (
              <>
                <div className="overflow-x-auto shadow-xl rounded-lg">
                  <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Property",
                          "Agent",
                          "Client",
                          "Price",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {currentTransactions.map((t) => (
                        <tr
                          key={t._id || (t as any).id}
                          className="hover:bg-gray-50">

                          <td className="px-6 py-4 text-sm text-gray-900">
                            {typeof (t as any).propertyRef === "object"
                              ? (t as any).propertyRef?.title || "N/A"
                              : String((t as any).propertyRef)}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700">
                            {typeof (t as any).agent === "object"
                              ? (t as any).agent?.name || "N/A"
                              : String((t as any).agent || "-")}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700">
                            {(t as any).client?.firstName
                              ? `${(t as any).client.firstName} ${
                                  (t as any).client.lastName || ""
                                }`
                              : (t as any).client?.name || "-"}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700">
                            ${t.price?.toLocaleString() || 0}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700">
                            {t.status}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            <Link
                              href={`/transactions/create?id=${t._id || (t as any).id}`}>
                              <button className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-500">
                                Edit
                              </button>
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(t._id || (t as any).id)
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
                      Previous
                    </button>

                    <span className="text-sm text-gray-700">
                      Page <b>{currentPage}</b> of <b>{totalPages}</b>
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
