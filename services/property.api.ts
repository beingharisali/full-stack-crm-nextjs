// src/services/propertyService.js
import http from "./http";
import { Property } from "../types/property";

export async function createProperty(
	formData: FormData
): Promise<{ property: Property }> {
	const res = await http.post("/create-property", formData);
	return res.data;
}

export async function allProperties(): Promise<{ properties: Property[] }> {
	const res = await http.get("/get-property");
	return res.data;
}

export async function getSingleProperty(
	id: string
): Promise<{ property: Property }> {
	const res = await http.get(`/get-single-property/${id}`);
	return res.data;
}

export async function updateProperty(
	id: string,
	updates: FormData | Partial<Property>
): Promise<{ property: Property }> {
	const config =
		updates instanceof FormData
			? undefined
			: {
					headers: {
						"Content-Type": "application/json",
					},
			  };

	const res = await http.patch(`/edit-property/${id}`, updates, config);

	return res.data;
}

export async function deleteProperty(id: string): Promise<{ message: string }> {
	const res = await http.delete(`/delete-property/${id}`);
	return res.data;
}
