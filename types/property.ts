export type UserRole = "admin" | "agent" | "user";
export interface Property {
  title: string;
  price: number;
  city: string;
  createdBy: string;
  desc: string;
  imageURL: string;
  _id: string;
}
export interface AuthResponse {
  property: Property;
}
