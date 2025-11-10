// src/services/propertyService.js
import http from "./http";
import { Property } from "../types/property";
import { useState } from "react";
const [loading, setloading] = useState(false);

// Create property
export async function createProperty(
  title: string,
  price: number,
  city: string,
  createdBy: string,
  desc: string,
  imageURL: string
): Promise<{ property: Property }> {
  setloading(true);
  const res = await http.post("/create-property", {
    title,
    price,
    city,
    createdBy,
    desc,
    imageURL,
  });
  setloading(false);
  return res.data;
}

// Get all properties
export async function allProperties(): Promise<{ property: Property[] }> {
  setloading(true);
  const res = await http.get("/get-property");
  setloading(false);
  return res.data;
}

// Get single property by ID
export async function getSingleProperty(
  id: string
): Promise<{ property: Property }> {
  setloading(true);
  const res = await http.get(`/get-single-property/${id}`);
  setloading(false);
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
  setloading(true);
  const res = await http.patch(`/edit-properties/${id}`, updates);
  setloading(false);
  return res.data;
}

// Delete property
export async function deleteProperty(id: string): Promise<{ message: string }> {
  setloading(true);
  const res = await http.delete(`/delete-property/${id}`);
  setloading(false);
  return res.data;
}
