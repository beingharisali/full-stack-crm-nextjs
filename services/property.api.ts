// src/services/propertyService.js
import http from "./http";
import { Property } from "../types/property";

export async function createProperty(
	formData: FormData
): Promise<{ property: Property }> {
	try {
		const res = await http.post("/create-property", formData);
		return res.data;
	} catch (error) {
		throw error;
	}
}

export async function allProperties(): Promise<{ properties: Property[] }> {
	try {
		const res = await http.get("/get-property");
		return res.data;
	} catch (error) {
		throw error;
	}
}

export async function getSingleProperty(
	id: string
): Promise<{ property: Property }> {
	try {
		const res = await http.get(`/get-single-property/${id}`);
		return res.data;
	} catch (error) {
		throw error;
	}
}

export async function updateProperty(
	id: string,
	updates: FormData | Partial<Property>
): Promise<{ property: Property }> {
	let config = undefined;

	if (!(updates instanceof FormData)) {
		config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
	}

	try {
		const res = await http.patch(`/edit-property/${id}`, updates, config);
		return res.data;
	} catch (error) {
		throw error;
	}
}

export async function deleteProperty(id: string): Promise<{ message: string }> {
	try {
		const res = await http.delete(`/delete-property/${id}`);
		return res.data;
	} catch (error) {
		throw error;
	}
}

export async function approveProperty(id: string): Promise<{ property: Property }> {
	try {
		const res = await http.patch(`/approve-property/${id}`);
		return res.data;
	} catch (error) {
		throw error;
	}
}

export async function rejectProperty(id: string): Promise<{ property: Property }> {
	try {
		const res = await http.patch(`/reject-property/${id}`);
		return res.data;
	} catch (error) {
		throw error;
	}
}
