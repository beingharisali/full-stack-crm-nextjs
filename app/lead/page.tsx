"use client";
import React, { useEffect, useState } from "react";
import { allLead } from "@/services/lead.api";
import Link from "next/link";

export default function LeadsPage() {
	const [leads, setLeads] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getLeads();
	}, []);

	async function getLeads() {
		setLoading(true);
		try {
			const res = await allLead();
			setLeads(res.leads || []);
		} catch (err) {
			console.error("Failed to fetch leads:", err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Leads</h1>
				<Link href="/lead/create">
					<button className="bg-blue-600 text-white px-4 py-2 rounded">
						New Lead
					</button>
				</Link>
			</div>

			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="space-y-3">
					{leads.length === 0 ? (
						<p>No leads found.</p>
					) : (
						leads.map((l) => (
							<div key={l._id} className="p-4 border rounded">
								<h3 className="font-semibold">{l.name}</h3>
								<p className="text-sm">Email: {l.email}</p>
								<p className="text-sm">Message: {l.message}</p>
								<p className="text-sm">Property ID: {l.propertyRef}</p>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}
