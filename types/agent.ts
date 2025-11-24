export interface Agent {
	_id: string;
	name: string;
	email: string;
	assignedProperties: string[];
}
export interface AuthResponse {
	agent: Agent;
}
