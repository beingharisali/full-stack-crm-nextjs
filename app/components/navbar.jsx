import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import Link from "next/link";
import { useTokenData } from "@/lib/token";
import LogoutModal from "@/components/LogoutModal";

function Navbar() {
	const { user, logoutUser } = useAuthContext();
	const [tokenData, tokenLoading] = useTokenData();
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

	const handleLogoutClick = () => {
		setIsLogoutModalOpen(true);
	};

	const handleLogoutConfirm = async () => {
		try {
			await logoutUser();
			console.log("User logged out successfully");
			setIsLogoutModalOpen(false);
		} catch (error) {
			console.log("logout failed ", error);
			setIsLogoutModalOpen(false);
		}
	};

	const handleLogoutCancel = () => {
		setIsLogoutModalOpen(false);
	};

	if (!tokenLoading && tokenData && tokenData.role === "admin") {
		return (
			<>
				<header className="bg-white shadow-sm sticky top-0 z-40">
					<div className="container mx-auto px-4">
						<div className="flex items-center justify-between h-16">
							<Link
								href={"/welcome"}
								className="flex items-center space-x-2 group">
								<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="white"
										className="w-6 h-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
										/>
									</svg>
								</div>
								<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									CRM Admin
								</span>
							</Link>
							
							<nav className="hidden md:flex items-center space-x-1">
								<Link 
									href={"/welcome"}
									className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
									Dashboard
								</Link>
								<Link
									href={"/properties/property"}
									className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
									Client Panel
								</Link>
								<button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
									Contact
								</button>
							</nav>
							
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
										<span className="text-white text-sm font-medium">
											{user?.firstName?.charAt(0) || 'A'}
										</span>
									</div>
									<span className="hidden md:block text-sm font-medium text-gray-700">
										{user?.firstName || 'Admin'}
									</span>
								</div>
								
								<button
									onClick={handleLogoutClick}
									className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md">
									<span>Logout</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-4 h-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</header>
				
				<LogoutModal 
					isOpen={isLogoutModalOpen}
					onClose={handleLogoutCancel}
					onConfirm={handleLogoutConfirm}
				/>
			</>
		);
	}
	
	return (
		<>
			<header className="bg-white shadow-sm sticky top-0 z-40">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<Link
							href={"/properties/property"}
							className="flex items-center space-x-2 group">
							<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="white"
									className="w-6 h-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
									/>
								</svg>
							</div>
							<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								CRM
							</span>
						</Link>
						
						<nav className="hidden md:flex items-center space-x-1">
							<button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
								Home
							</button>
							<button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
								Services
							</button>
							<button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
								Contact
							</button>
						</nav>
						
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
									<span className="text-white text-sm font-medium">
										{user?.firstName?.charAt(0) || 'U'}
									</span>
								</div>
								<span className="hidden md:block text-sm font-medium text-gray-700">
									{user?.firstName || 'User'}
								</span>
							</div>
							
							<button
								onClick={handleLogoutClick}
								className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md">
								<span>Logout</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-4 h-4">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>
			
			<LogoutModal 
				isOpen={isLogoutModalOpen}
				onClose={handleLogoutCancel}
				onConfirm={handleLogoutConfirm}
			/>
		</>
	);
}

export default Navbar;