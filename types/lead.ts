export interface Lead {
	name: string;
	email: string;
	message: string;
	propertyRef: string;
}
export interface AuthResponse {
	lead: Lead;
}
