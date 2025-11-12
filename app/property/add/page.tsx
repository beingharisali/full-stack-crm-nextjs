"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createProperty } from "../../../services/property.api "; // ✅ corrected import path
import { toast } from "react-toastify";

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [property, setProperty] = useState({
    title: "",
    price: "",
    city: "",
    desc: "",
    imageURL: "",
    createdBy: "",
  });

  // ✅ Handle input changes (typed properly)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit (typed properly)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProperty(
        property.title,
        Number(property.price),
        property.city,
        property.createdBy || "Admin",
        property.desc,
        property.imageURL
      );

      toast.success("Property created successfully!");
      console.log("✅ Property created successfully!");
      router.push("/properties"); // Redirect after success
    } catch (error) {
      console.error("❌ Error creating property:", error);
      toast.error("Failed to add property. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <label className="font-semibold">Image URL</label>
              <Input
                name="imageURL"
                value={property.imageURL}
                onChange={handleChange}
                placeholder="Paste image URL"
              />
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

            <Button type="submit" className="w-full mt-3" disabled={loading}>
              {loading ? "Adding..." : "Add Property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
