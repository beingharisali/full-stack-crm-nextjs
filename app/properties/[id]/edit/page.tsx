"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { getSingleProperty, updateProperty } from "@/services/property.api";

interface PropertyData {
	title: string;
	price: string;
	city: string;
	desc: string;
	imageURL: string;
}

export default function EditPropertyPage() {
	const router = useRouter();
	const params = useParams();
	const propertyId = params.id as string;

	const [loading, setLoading] = useState(false);
	const [property, setProperty] = useState<PropertyData>({
		title: "",
		price: "",
		city: "",
		desc: "",
		imageURL: "",
	});
	const [newImageFile, setNewImageFile] = useState<File | null>(null);

	useEffect(() => {
		async function fetchData() {
			if (!propertyId) return;

			try {
				const res = await getSingleProperty(propertyId);
				setProperty({
					title: res.property.title || "",
					price: res.property.price?.toString() || "",
					city: res.property.city || "",
					desc: res.property.desc || "",
					imageURL: res.property.imageURL || "",
				});
			} catch (error) {
				toast.error("Failed to load property data");
			}
		}
		fetchData();
	}, [propertyId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setProperty({ ...property, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setNewImageFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		let payload: FormData | { [key: string]: any };

		if (newImageFile) {
			const formData = new FormData();
			formData.append("title", property.title);
			formData.append("price", property.price);
			formData.append("city", property.city);
			formData.append("desc", property.desc);
			formData.append("image", newImageFile);

			payload = formData;
		} else {
			payload = {
				title: property.title,
				price: Number(property.price),
				city: property.city,
				desc: property.desc,
				imageURL: property.imageURL,
			};
		}

		try {
			await updateProperty(propertyId, payload);

			toast.success("Property updated successfully!");

			setNewImageFile(null);

			setTimeout(() => {
				router.push("/properties");
			}, 1000);
		} catch (error) {
			toast.error("Update failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
			<Card className="w-full max-w-lg shadow-lg rounded-2xl">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold text-gray-700">
						Edit Property
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
								placeholder="Enter price"
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

						{property.imageURL && (
							<div className="mt-4">
								<label className="font-semibold block mb-2">
									Current Image
								</label>
								<img
									src={property.imageURL}
									alt="Current Property"
									className="w-full h-40 object-cover rounded-lg border border-gray-300"
								/>
							</div>
						)}

						<div>
							<label className="font-semibold block mb-1">
								Choose New Image (Optional)
							</label>
							<Input
								name="newImage"
								type="file"
								onChange={handleFileChange}
								className="p-1 h-auto"
							/>
							{newImageFile && (
								<p className="text-sm text-green-600 mt-1">
									File selected: {newImageFile.name}
								</p>
							)}
							{!newImageFile && property.imageURL && (
								<p className="text-sm text-gray-500 mt-1">
									Keeping current image.
								</p>
							)}
						</div>

						<Button type="submit" className="w-full mt-3" disabled={loading}>
							{loading ? "Updating..." : "Update Property"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
