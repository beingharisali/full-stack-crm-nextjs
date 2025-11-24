export interface Transaction {
	_id?: string;
	client: string;
	agent: string;
	propertyRef: string;
	price: number;
	status: "complete" | "pending" | "closed";
	createdAt?: string;
	updatedAt?: string;
}
