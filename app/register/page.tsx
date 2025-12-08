"use client";

import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
	const { registerUser } = useAuthContext();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		role: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);

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
		<div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
			<Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
				<CardHeader>
					<CardTitle className="text-center text-3xl font-semibold text-gray-800">
						Sign Up
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								First Name
							</label>
							<Input
								name="firstName"
								type="text"
								required
								value={formData.firstName}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Last Name
							</label>
							<Input
								name="lastName"
								type="text"
								required
								value={formData.lastName}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<Input
								name="email"
								type="email"
								required
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<Input
								name="password"
								type="password"
								required
								value={formData.password}
								onChange={handleChange}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Confirm Password
							</label>
							<Input
								name="confirmPassword"
								type="password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Role
							</label>
							<select
								name="role"
								required
								value={formData.role}
								onChange={handleChange}
								className="mt-1 block w-full border-gray-300 rounded-md p-2">
								<option value="">Select Role</option>
								<option value="admin">Admin</option>
								<option value="agent">Agent</option>
								<option value="user">User</option>
							</select>
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Registering..." : "Register"}
						</Button>

						<p className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<Link href="/" className="text-blue-600 hover:underline">
								Login
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
