"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { getSingleProperty, updateProperty } from "@/services/property.api ";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState({
    title: "",
    price: "",
    city: "",
    desc: "",
    imageURL: "",
  });


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getSingleProperty(propertyId);
        setProperty({
          title: res.property.title || "",
          price: res.property.price?.toString() || "",
          city: res.property.city || "",
          desc: res.property.desc || "",
          imageURL: res.property.imageURL || "",
        });
      } catch (error) {
        toast.error("Failed to load property data");
      }
    }
    if (propertyId) fetchData();
  }, [propertyId]);

  // ✅ Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  // ✅ Update property
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProperty(propertyId, {
        title: property.title,
        price: Number(property.price),
        city: property.city,
        desc: property.desc,
        imageURL: property.imageURL,
      });

      toast.success("Property updated successfully!");

      // ✅ Clear input fields after submit
      setProperty({
        title: "",
        price: "",
        city: "",
        desc: "",
        imageURL: "",
      });

      // ✅ Redirect after short delay
      setTimeout(() => {
        router.push("/properties");
      }, 1000);
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-700">
            Edit Property
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
                placeholder="Enter price"
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

            <Button type="submit" className="w-full mt-3" disabled={loading}>
              {loading ? "Updating..." : "Update Property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
