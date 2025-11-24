import http from "./http";
import { Agent } from "../types/agent";

interface AgentCreatePayload {
	name: string;
	email: string;
	assignedProperties: string[];
}

export async function createAgent(
	agentData: AgentCreatePayload
): Promise<{ agent: Agent }> {
	try {
		const res = await http.post("/create-agent", agentData, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return res.data;
	} catch (error) {
		console.error("Error creating agent:", error);
		throw error;
	}
}

export async function allAgents(): Promise<{ agents: Agent[] }> {
	try {
		const res = await http.get("/get-agents");
		return res.data;
	} catch (error) {
		console.error("Error fetching all agents:", error);
		throw error;
	}
}

export async function getSingleAgent(id: string): Promise<{ agent: Agent }> {
	try {
		const res = await http.get(`/get-agent/${id}`);
		return res.data;
	} catch (error) {
		console.error(`Error fetching agent ${id}:`, error);
		throw error;
	}
}

export async function updateAgent(
	id: string,
	updates: FormData | Partial<Agent>
): Promise<{ agent: Agent }> {
	let config = undefined;

	if (!(updates instanceof FormData)) {
		config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
	}

	try {
		const res = await http.patch(`/update-agent/${id}`, updates, config);
		return res.data;
	} catch (error) {
		console.error(`Error updating agent ${id}:`, error);
		throw error;
	}
}

export async function deleteAgent(id: string): Promise<{ message: string }> {
	try {
		const res = await http.delete(`/delete-agent/${id}`);
		return res.data;
	} catch (error) {
		console.error(`Error deleting agent ${id}:`, error);
		throw error;
	}
}
