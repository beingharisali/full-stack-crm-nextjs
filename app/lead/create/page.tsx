"use client";

import React, { useEffect, useState } from "react";
import { createLead } from "@/services/lead.api";
import { allProperties } from "@/services/property.api";
import { Property } from "@/types/property";
import { Loader2, ArrowLeft, User, Mail, MessageSquare, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  MessageSquare,
  Home,
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectRoute";

export default function CreateLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    propertyRef: "",
  });

  useEffect(() => {
    getProperties();
  }, []);

  async function getProperties() {
    try {
      const res = await allProperties();
      setProperties(res.properties || []);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to load properties:", err);
      }
      toast.error("Failed to load properties");
    }
  }

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!form.name || !form.email || !form.message || !form.propertyRef) {
			toast.error("Please fill in all fields");
			return;
		}

    setLoading(true);
    try {
      await createLead(form);
      toast.success("Lead submitted successfully!");
      router.push("/lead");
    } catch (err) {
      toast.error("Failed to submit lead");
      if (process.env.NODE_ENV !== "production") {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Create New Lead
              </h1>
              <p className="text-slate-600">
                Fill in the details below to create a new lead
              </p>
            </div>
          </div>

          <Card className="shadow-lg border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Lead Information
              </CardTitle>
              <CardDescription>
                Enter the lead details and select the associated property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="transition-colors focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="transition-colors focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Enter your message or inquiry"
                    className="min-h-[120px] resize-vertical transition-colors focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="propertyRef"
                    className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Select Property *
                  </label>
                  <select
                    id="propertyRef"
                    name="propertyRef"
                    value={form.propertyRef}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    required
                    disabled={loading}>
                    <option value="">Choose a property</option>
                    {properties.map((property) => (
                      <option key={property._id} value={property._id}>
                        {property.title} - {property.city}{" "}
                        {property.type ? `• ${property.type}` : ""}
                      </option>
                    ))}
                  </select>
                  {properties.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Loading available properties...
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-slate-300 hover:bg-slate-50"
                    disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating Lead...
                      </>
                    ) : (
                      "Create Lead"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              All fields marked with * are required. The lead will be assigned to
              the selected property.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function CreateLeadPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center">
					<div className="flex items-center gap-2 text-slate-600">
						<Loader2 className="h-5 w-5 animate-spin" />
						<span>Loading...</span>
					</div>
				</div>
			}>
			<CreateLeadForm />
		</Suspense>
	);
}