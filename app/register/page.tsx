"use client";

import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, Users } from "lucide-react";

export default function RegisterPage() {
	const { registerUser } = useAuthContext();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		role: "user",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match!");
			return;
		}

		if (!formData.role) {
			toast.error("Please select a role!");
			return;
		}

		try {
			setLoading(true);
			await registerUser(
				formData.firstName,
				formData.lastName,
				formData.email,
				formData.password,
				formData.role as any
			);
		} catch (error) {
			const e = error as { response?: { data?: { msg?: string } } };
			const errorMsg = e.response?.data?.msg || "Registration failed";
			toast.error(errorMsg);
			if (process.env.NODE_ENV !== "production") {
				console.error("Registration failed:", error);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/20"></div>
			<div className="relative z-10 w-full max-w-md">
				<Card className="shadow-2xl bg-white/95 backdrop-blur-lg border-0 rounded-2xl overflow-hidden">
					<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
						<h1 className="text-3xl font-bold text-white">Create Account</h1>
						<p className="text-blue-100 mt-2">
							Join us today and get started
						</p>
					</div>
					
					<CardHeader className="pt-6 pb-2">
						<CardTitle className="text-2xl font-bold text-center text-gray-800">
							Sign Up
						</CardTitle>
						<CardDescription className="text-center text-gray-600">
							Enter your information to create an account
						</CardDescription>
					</CardHeader>

					<CardContent className="pb-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center">
									<User className="mr-2 h-4 w-4" />
									Full Name
								</label>
								<div className="grid grid-cols-2 gap-3">
									<Input
										name="firstName"
										type="text"
										placeholder="First Name"
										required
										value={formData.firstName}
										onChange={handleChange}
										className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
									<Input
										name="lastName"
										type="text"
										placeholder="Last Name"
										required
										value={formData.lastName}
										onChange={handleChange}
										className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
							</div>
							
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center">
									<Mail className="mr-2 h-4 w-4" />
									Email Address
								</label>
								<div className="relative">
									<Input
										name="email"
										type="email"
										placeholder="you@example.com"
										required
										value={formData.email}
										onChange={handleChange}
										className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								</div>
							</div>
							
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center">
									<Lock className="mr-2 h-4 w-4" />
									Password
								</label>
								<div className="relative">
									<Input
										name="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										required
										value={formData.password}
										onChange={handleChange}
										className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>
							
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center">
									<Lock className="mr-2 h-4 w-4" />
									Confirm Password
								</label>
								<div className="relative">
									<Input
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="••••••••"
										required
										value={formData.confirmPassword}
										onChange={handleChange}
										className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>
							
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center">
									<Users className="mr-2 h-4 w-4" />
									Role
								</label>
								<select
									name="role"
									required
									value={formData.role}
									onChange={handleChange}
									className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
								>
									<option value="user">User</option>
									<option value="agent">Agent</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<Button 
								type="submit" 
								disabled={loading}
								className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 rounded-md transition-all duration-300 transform hover:scale-[1.02]"
							>
								{loading ? "Creating Account..." : "Create Account"}
							</Button>

							<div className="relative my-6">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white text-gray-500">
										Already have an account?
									</span>
								</div>
							</div>

							<div className="text-center">
								<Link 
									href="/" 
									className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
								>
									Sign In Instead
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>
				
				<div className="text-center mt-6 text-white/80">
					<p className="text-sm">© 2023 CRM System. All rights reserved.</p>
				</div>
			</div>
		</div>
	);
}