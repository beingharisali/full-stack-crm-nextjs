"use client";

import { useTokenData } from "@/lib/token";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function Dashboard() {
  const [tokenData, tokenLoading] = useTokenData();

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
          🚫 Unauthorized
        </h1>
        <p className="text-gray-600">Please log in to access the dashboard.</p>
      </div>
    );
  }

  if (tokenData?.role !== "admin") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">
            🚫 Access Denied
          </h1>
          <p className="text-gray-600">Only admins can access the dashboard.</p>
        </div>
      </>
    );
  }

  const userName = tokenData?.firstName || "Admin";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex grow">
          <Sidebar />

          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <section className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here’s your CRM overview and quick access tools.
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Leads
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">243</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm text-green-600 font-medium">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    12% increase
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    from last month
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Properties
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      120
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm text-green-600 font-medium">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    8% increase
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    from last month
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Closed Deals
                    </p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">
                      58
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm text-red-600 font-medium">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    3% decrease
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    from last month
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Tasks
                    </p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">9</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm text-green-600 font-medium">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    5% decrease
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    from last month
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Quick Access
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  href="/lead"
                  className="block bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition duration-300 group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Manage Leads
                    </h3>
                    <span className="text-blue-500 text-xl font-bold">›</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    View and track client leads.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    Go to Leads
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/properties"
                  className="block bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition duration-300 group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                      Properties
                    </h3>
                    <span className="text-green-500 text-xl font-bold">›</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Manage property listings.
                  </p>
                  <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                    View Properties
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/transactions"
                  className="block bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition duration-300 group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      Transactions
                    </h3>
                    <span className="text-purple-500 text-xl font-bold">›</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Track property sales and payments.
                  </p>
                  <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                    View Transactions
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/agent"
                  className="block bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition duration-300 group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                      Agents
                    </h3>
                    <span className="text-teal-500 text-xl font-bold">›</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    View and manage team members.
                  </p>
                  <div className="mt-4 flex items-center text-teal-600 text-sm font-medium">
                    Manage Agents
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/reports"
                  className="block bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition duration-300 group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      Reports
                    </h3>
                    <span className="text-indigo-500 text-xl font-bold">›</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Analyze CRM data and performance.
                  </p>
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                    View Reports
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/profile"
                  className="block bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition duration-300 group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-600 transition-colors">
                      Settings
                    </h3>
                    <span className="text-gray-500 text-xl font-bold">›</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Configure your CRM preferences.
                  </p>
                  <div className="mt-4 flex items-center text-gray-600 text-sm font-medium">
                    Manage Settings
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
