"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createProperty } from "../../../services/property.api";
import { allAgents } from "@/services/agent.api";
import { toast } from "react-toastify";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectRoute";

interface PropertyState {
  title: string;
  price: string;
  city: string;
  desc: string;
  createdBy: string;
  imageFile: File | null;
  assignedTo: string;
}

export default function AddPropertyPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<{ _id: string; name: string }[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);

  const [property, setProperty] = useState<PropertyState>({
    title: "",
    price: "",
    city: "",
    desc: "",
    createdBy: "",
    imageFile: null,
    assignedTo: "",
  });

  useEffect(() => {
    getAgents();
  }, []);

  async function getAgents() {
    setAgentsLoading(true);
    try {
      const res = await allAgents();
      setAgents(res.agents || []);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to load agents:", err);
      }
      toast.error("Failed to load agents");
    } finally {
      setAgentsLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    setProperty((prev) => ({
      ...prev,
      imageFile: selectedFile,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!property.imageFile) {
      toast.error("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();

    formData.append("title", property.title);
    formData.append("price", property.price);
    formData.append("city", property.city);
    formData.append("desc", property.desc);
    formData.append("createdBy", property.createdBy || "Admin");
    if (property.imageFile) {
      formData.append("images", property.imageFile);
    }

    if (property.assignedTo) {
      formData.append("agentId", property.assignedTo);
    }
    try {
      await createProperty(formData);
      toast.success("Property created successfully!");

      router.push("/properties");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("❌ Error creating property:", error);
      }
      const msg =
        (error as any)?.response?.data?.msg ||
        (error as any)?.message ||
        "Failed to add property. Try again.";
      toast.error(msg);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "agent", "user"]}>
      <>
        <Link href={"/properties"}>
          <button className="m-5 bg-blue-800 text-white px-3 py-2 rounded-md absolute">
            Back
          </button>
        </Link>
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
          <Card className="w-full max-w-lg shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-700">
                Add New Property
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-semibold">Title</label>
                  <Input
                    name="title"
                    value={property.title}
                    onChange={handleChange}
                    placeholder="Enter property title"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold">Price</label>
                  <Input
                    name="price"
                    type="number"
                    value={property.price}
                    onChange={handleChange}
                    placeholder="Enter property price"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold">City</label>
                  <Input
                    name="city"
                    value={property.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold">Description</label>
                  <Textarea
                    name="desc"
                    value={property.desc}
                    onChange={handleChange}
                    placeholder="Enter property description"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold">Property Image</label>
                  <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFiles}
                    required
                  />
                  {property.imageFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected File: **{property.imageFile.name}**
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold">Created By</label>
                  <Input
                    name="createdBy"
                    value={property.createdBy}
                    onChange={handleChange}
                    placeholder="Enter creator name or ID"
                  />
                </div>

                <div>
                  <label className="font-semibold">Assign Agent</label>
                  {agentsLoading ? (
                    <div className="w-full p-2 border border-gray-300 rounded-md text-gray-500">
                      Loading agents...
                    </div>
                  ) : (
                    <select
                      name="agentId"
                      value={(property as any).assignedTo}
                      onChange={(e) =>
                        setProperty({ ...property, assignedTo: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">None</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <Button type="submit" className="w-full mt-3">
                  Add Property
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </>
    </ProtectedRoute>
  );
}
