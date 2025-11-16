import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";

interface DecodedToken {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: "admin" | "agent" | "user" | string;
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
				setDecodedData(data);
			} catch (error) {
				console.error("Error occurred in decoding the token:", error);
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
