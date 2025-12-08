export interface Agent {
	_id: string;
	name: string;
	email: string;
	assignedProperties: string[];
	isActive?: boolean;
}
export interface AuthResponse {
	agent: Agent;
}
