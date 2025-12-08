import http from "./http";
import { Transaction } from "../types/transaction";

export async function createTransaction(
	payload: Transaction
): Promise<{ transaction: Transaction }> {
	const res = await http.post("/create-transaction", payload);
	return { transaction: res.data.data };
}

export async function updateTransaction(
	id: string,
	updates: FormData | Partial<Transaction>
): Promise<{ transaction: Transaction }> {
	const config =
		updates instanceof FormData
			? undefined
			: {
					headers: {
						"Content-Type": "application/json",
					},
			  };

	const res = await http.patch(`/update-transaction/${id}`, updates, config);

	return { transaction: res.data.data };
}

export async function allTransactions(): Promise<{
	transactions: Transaction[];
}> {
	const res = await http.get("/get-transactions");
	return { transactions: res.data.data };
}

export async function getSingleTransaction(
	id: string
): Promise<{ transaction: Transaction }> {
	const res = await http.get(`/get-transaction/${id}`);
	return { transaction: res.data.data };
}

export async function deleteTransaction(
	id: string
): Promise<{ message: string }> {
	const res = await http.delete(`/delete-transaction/${id}`);
	return res.data;
}
