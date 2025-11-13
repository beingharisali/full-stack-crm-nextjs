"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createProperty } from "../../../services/property.api";
import { toast } from "react-toastify";

interface PropertyState {
	title: string;
	price: string;
	city: string;
	desc: string;
	createdBy: string;
	imageFile: File | null;
}

export default function AddPropertyPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [property, setProperty] = useState<PropertyState>({
		title: "",
		price: "",
		city: "",
		desc: "",
		createdBy: "",
		imageFile: null,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setProperty({ ...property, [e.target.name]: e.target.value });
	};

	const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files ? e.target.files[0] : null;

		setProperty((prev) => ({
			...prev,
			imageFile: selectedFile,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		if (!property.imageFile) {
			toast.error("Please select an image file to upload.");
			setLoading(false);
			return;
		}

		const formData = new FormData();

		formData.append("title", property.title);
		formData.append("price", property.price);
		formData.append("city", property.city);
		formData.append("desc", property.desc);
		formData.append("createdBy", property.createdBy || "Admin");
		formData.append("image", property.imageFile);
		try {
			await createProperty(formData);
			toast.success("Property created successfully!");
			console.log("✅ Property created successfully!");
			router.push("/properties");
		} catch (error) {
			console.error("❌ Error creating property:", error);
			toast.error("Failed to add property. Try again.");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
			<Card className="w-full max-w-lg shadow-lg rounded-2xl">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold text-gray-700">
						Add New Property
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="font-semibold">Title</label>
							<Input
								name="title"
								value={property.title}
								onChange={handleChange}
								placeholder="Enter property title"
								required
							/>
						</div>

						<div>
							<label className="font-semibold">Price</label>
							<Input
								name="price"
								type="number"
								value={property.price}
								onChange={handleChange}
								placeholder="Enter property price"
								required
							/>
						</div>

						<div>
							<label className="font-semibold">City</label>
							<Input
								name="city"
								value={property.city}
								onChange={handleChange}
								placeholder="Enter city"
								required
							/>
						</div>

						<div>
							<label className="font-semibold">Description</label>
							<Textarea
								name="desc"
								value={property.desc}
								onChange={handleChange}
								placeholder="Enter property description"
								required
							/>
						</div>

						<div>
							<label className="font-semibold">Property Image</label>
							<Input
								type="file"
								name="image"
								accept="image/*"
								onChange={handleFiles}
								required
							/>
							{property.imageFile && (
								<p className="text-sm text-gray-500 mt-1">
									Selected File: **{property.imageFile.name}**
								</p>
							)}
						</div>

						<div>
							<label className="font-semibold">Created By</label>
							<Input
								name="createdBy"
								value={property.createdBy}
								onChange={handleChange}
								placeholder="Enter creator name or ID"
							/>
						</div>

						<Button type="submit" className="w-full mt-3" disabled={loading}>
							{loading ? "Adding..." : "Add Property"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
