"use client";

import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
	const { loginUser } = useAuthContext();
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		role: "",
	});

	const [loading, setLoading] = useState(false);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) {
		const { name, value } = e.target; // Destructuring name and value
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		try {
			setLoading(true);
			await loginUser(formData.email, formData.password, formData.role as any);
		} catch (error) {
			const e = error as { response?: { data?: { msg?: string } } };
			alert(e.response?.data?.msg || "Registration failed");
			console.error("Registration failed:", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
			<Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
				<CardHeader>
					<CardTitle className="text-center text-3xl font-semibold text-gray-800">
						Login
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Added Email field for completeness */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<Input
								name="email"
								type="email"
								placeholder="john.doe@example.com"
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
								placeholder="********"
								required
								value={formData.password}
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

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
							Login
						</Button>

						<p className="text-center text-sm text-gray-600">
							Do not have an account?{" "}
							<Link href="/register" className="text-blue-600 hover:underline">
								{/* CORRECTED: Link to /login which is more standard than /signup */}
								Sign up
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
