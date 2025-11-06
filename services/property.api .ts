// src/services/propertyService.js
import http from "./http";
import { Property } from "../types/property";

// Create property
export async function createProperty(
  title: string,
  price: number,
  city: string,
  createdBy: string,
  desc: string,
  imageURL: string
): Promise<{ property: Property }> {
  const res = await http.post("/create-property", {
    title,
    price,
    city,
    createdBy,
    desc,
    imageURL,
  });
  return res.data;
}

// Get all properties
export async function allProperties(): Promise<{ property: Property[] }> {
  const res = await http.get("/get-property");
  return res.data;
}

// Get single property by ID
export async function getSingleProperty(
  id: string
): Promise<{ property: Property }> {
  const res = await http.get(`/get-single-property/${id}`);
  return res.data;
}

// Update property
export async function updateProperty(
  id: string,
  updates: Partial<{
    title: string;
    price: number;
    city: string;
    desc: string;
    imageURL: string;
  }>
): Promise<{ property: Property }> {
  const res = await http.patch(`/edit-properties/${id}`, updates);
  return res.data;
}

// Delete property
export async function deleteProperty(id: string): Promise<{ message: string }> {
  const res = await http.delete(`/delete-property/${id}`);
  return res.data;
}
