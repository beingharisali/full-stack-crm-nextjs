import React from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import ProtectedRoute from "../components/ProtectRoute";

function Page() {
	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<div>
				<Navbar />
				<Sidebar />
			</div>
		</ProtectedRoute>
	);
}

export default Page;
