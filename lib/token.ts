"use client";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";

interface DecodedToken {
	firstName: string;
	lastName: string;
	email: string;
	userId: string;
	password: string;
	role: "admin" | "agent" | "user" | string;
	exp?: number; 
}

export function useTokenData(): [DecodedToken | null, boolean] {
	const [tokenData, setDecodedData] = useState<DecodedToken | null>(null);
	const [loading, setLoading] = useState(true);

	const decodeToken = useCallback(() => {
		setLoading(true);
		const token = localStorage.getItem("token");

		if (token) {
			try {
				const data = jwtDecode<DecodedToken>(token);
				if (data.exp && Date.now() >= data.exp * 1000) {
					localStorage.removeItem("token");
					setDecodedData(null);
				} else {
					setDecodedData(data);
				}
			} catch (error) {
				console.error("Error occurred in decoding the token:", error);
				localStorage.removeItem("token");
				setDecodedData(null);
			}
		} else {
			setDecodedData(null);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		decodeToken();
	}, [decodeToken]);

	return [tokenData, loading];
}