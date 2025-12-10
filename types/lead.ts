export interface Lead {
	name: string;
	email: string;
	message: string;
	propertyRef: string;
	_id?: string;
	status?: "new" | "contacted" | "qualified" | "converted";
	createdAt?: string;
}

export interface AuthResponse {
	lead: Lead;
}