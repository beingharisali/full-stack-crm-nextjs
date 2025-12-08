export interface Property {
	title: string;
	price: number;
	city: string;
	createdBy: string;
	desc: string;
	imageURL: string;
	_id: string;
	imageFile: null;
	assignedTo: string | null;
	status?: "pending" | "approved" | "rejected";
}
export interface AuthResponse {
	property: Property;
}
