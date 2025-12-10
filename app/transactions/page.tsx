"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { allTransactions, deleteTransaction } from "@/services/transaction.api";
import toast from "react-hot-toast";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import ProtectedRoute from "../components/ProtectRoute";

interface Transaction {
  _id?: string;
  client: string;
  agent: string;
  propertyRef: string;
  price?: number;
  status: "pending" | "complete" | "closed";
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const getTransactions = async () => {
    try {
      const res = await allTransactions();
      if (Array.isArray(res.transactions)) {
        setTransactions(res.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching transactions:", error);
      }
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const deleteTransactionHandler = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (isConfirmed) {
      try {
        await deleteTransaction(id);
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction._id !== id)
        );
        toast.success("Transaction deleted successfully");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error deleting transaction:", error);
        }
        toast.error("Failed to delete transaction");
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 p-8">
              <div className="text-center p-8 text-xl font-semibold text-gray-500">
                Loading transactions...
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (transactions.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  Transaction Records
                </h1>
                <Link href="/transactions/create">
                  <button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
                    Create Transaction
                  </button>
                </Link>
              </div>
              <div className="text-center p-8 text-xl font-semibold text-gray-700">
                No transactions found.
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Transaction Records
              </h1>
              <Link href="/transactions/create">
                <button className="p-3 text-[20px] rounded-2xl bg-blue-700 cursor-pointer hover:bg-blue-800 text-white active:bg-blue-500">
                  Create Transaction
                </button>
              </Link>
            </div>

            <div className="overflow-x-auto shadow-xl rounded-lg">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property Ref
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.agent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.propertyRef}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${transaction.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "complete"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "closed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <Link href={`/transactions/create?id=${transaction._id || ''}`}>
                          <button className="text-white text-[15px] bg-blue-700 rounded-md p-2 m-1 border-none cursor-pointer active:bg-blue-600 hover:bg-blue-500">
                            Edit
                          </button>
                        </Link>
                        {transaction._id && (
                          <button
                            onClick={() => transaction._id && deleteTransactionHandler(transaction._id)}
                            className="text-white text-[15px] bg-red-600 rounded-md p-2 m-1 border-none cursor-pointer active:bg-red-600 hover:bg-red-500">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}