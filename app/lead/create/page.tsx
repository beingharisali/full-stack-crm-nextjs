"use client";

import React, { useEffect, useState } from "react";
import { createLead } from "@/services/lead.api";
import { allProperties } from "@/services/property.api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateLeadPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [properties, setProperties] = useState<any[]>([]);
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
		propertyRef: "",
	});

	useEffect(() => {
		getProperties();
	}, []);

	async function getProperties() {
		try {
			const res = await allProperties();
			setProperties(res.properties || []);
		} catch (err) {
			console.error("Failed to load properties:", err);
		}
	}

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await createLead(form);
			toast.success("Lead submitted");
			router.push("/lead");
		} catch (err) {
			toast.error("Failed to submit lead");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 max-w-lg">
			<h1 className="text-2xl font-semibold mb-4">Create Lead</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Name</label>
					<Input
						name="name"
						value={form.name}
						onChange={handleChange as any}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Email</label>
					<Input
						name="email"
						value={form.email}
						onChange={handleChange as any}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Message</label>
					<Textarea
						name="message"
						value={form.message}
						onChange={handleChange as any}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Property</label>
					<select
						name="propertyRef"
						value={form.propertyRef}
						onChange={handleChange as any}
						className="w-full p-2 border rounded">
						<option value="">Select property</option>
						{properties.map((p) => (
							<option key={p._id} value={p._id}>
								{p.title} - {p.city}
							</option>
						))}
					</select>
				</div>
				<Button type="submit" disabled={loading}>
					{loading ? "Submitting..." : "Submit Lead"}
				</Button>
			</form>
		</div>
	);
}
