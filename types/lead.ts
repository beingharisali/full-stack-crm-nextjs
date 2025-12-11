export interface Lead {
	name: string;
	email: string;
	message: string;
	propertyRef: string;
	status?: string;
}
export interface AuthResponse {
	lead: Lead;
}
