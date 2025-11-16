"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTokenData } from "@/lib/token";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
	const [tokenData, tokenLoading] = useTokenData();
	const [route, setRoute] = useState("/properties/property");
	const [passwordType, setPasswordType] = useState("password");

	useEffect(() => {
		if (tokenData?.role === "admin") {
			setRoute("/properties");
		}
	}, [tokenData]);

	function togglePasswordType() {
		setPasswordType((prevType) =>
			prevType === "password" ? "text" : "password"
		);
	}

	if (tokenLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<h1 className="text-3xl">Loading data...</h1>
			</div>
		);
	}

	const data = {
		firstName: tokenData?.firstName,
		lastName: tokenData?.lastName,
		email: tokenData?.email,
		password: tokenData?.password,
		role: tokenData?.role,
	};

	return (
		<div>
			<div className="flex items-center justify-center min-h-screen bg-linear-to-br  p-6">
				<Link href={route}>
					<button className="bg-blue-700 text-white p-2 rounded text-xl absolute z-3 top-0 left-0 m-5 cursor-pointer hover:bg-blue-800 active:bg-blue-600">
						Back
					</button>
				</Link>
				<Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
					<CardHeader>
						<CardTitle className="text-center text-3xl font-semibold text-gray-800">
							Profile
						</CardTitle>
					</CardHeader>

					<CardContent>
						<div className="space-y-5">
							<h1>First Name</h1>
							<div className="border p-4 rounded">{data.firstName}</div>
							<h1>Last Name</h1>
							<div className="border p-4 rounded">{data.lastName}</div>
							<h1>Email</h1>
							<div className="border p-4 rounded">{data.email}</div>

							<h1>Password</h1>
							<div className="border p-4 rounded flex justify-between">
								<input
									className="border-none focus:outline-none w-full bg-transparent"
									type={passwordType}
									readOnly
									value={data.password || "********"}
								/>
								<button
									onClick={togglePasswordType}
									className="cursor-pointer text-blue-600 hover:text-blue-800">
									{passwordType === "password" ? "Show" : "Hide"}
								</button>
							</div>

							<h1>Role</h1>
							<div className="border p-4 rounded">{data.role}</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
