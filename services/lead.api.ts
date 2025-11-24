// src/services/propertyService.js
import http from "./http";
import { Lead } from "../types/lead";

export async function createLead(payload: {
	name: string;
	email: string;
	message: string;
	propertyRef: string;
}): Promise<{ lead: Lead }> {
	const res = await http.post("/create-lead", payload);
	return res.data;
}

export async function allLead(): Promise<{ leads: Lead[] }> {
	const res = await http.get("/get-leads");
	return res.data;
}

export async function getSingleLead(id: string): Promise<{ lead: Lead }> {
	const res = await http.get(`/get-lead/${id}`);
	return res.data;
}

export async function updateLead(
	id: string,
	updates: FormData | Partial<Lead>
): Promise<{ lead: Lead }> {
	const config =
		updates instanceof FormData
			? undefined
			: {
					headers: {
						"Content-Type": "application/json",
					},
			  };

	const res = await http.patch(`/update-lead/${id}`, updates, config);

	return res.data;
}

export async function deleteLead(id: string): Promise<{ message: string }> {
	const res = await http.delete(`/delete-lead/${id}`);
	return res.data;
}
