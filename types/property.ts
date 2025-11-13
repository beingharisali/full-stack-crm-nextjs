export interface Property {
	title: string;
	price: number;
	city: string;
	createdBy: string;
	desc: string;
	imageURL: string;
	_id: string;
	imageFile: null;
}
export interface AuthResponse {
	property: Property;
}
