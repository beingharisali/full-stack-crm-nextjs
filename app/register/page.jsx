"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "", 
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target; // Destructuring name and value
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Ensure email and role are not empty
    if (!formData.email || !formData.role) {
       alert("Please fill in your email and select a role.");
       return;
    }
    
    // Destructure the data to send, excluding confirmPassword
    const { confirmPassword, ...dataToSend } = formData;

    try {
      // Pass the dataToSend (which includes firstName, lastName, role, email, password)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACEND_URI}/register`,
        dataToSend
      );

      console.log("Registration Successful:", res.data);

      // Reset the form state
      setFormData({
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      
      // Redirect to login page on success
     

    } catch (err) {
      console.error("Error occurred during registration:", err.response ? err.response.data : err.message);
      alert("Registration failed. Please check your details and try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-800">
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <Input
                name="firstName" 
                type="text"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <Input
                name="lastName" 
                type="text"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            {/* Added Email field for completeness */}
             <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                name="password"
                type="password"
                placeholder="********"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="********"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700">Role</label> {/* New Label */}
              <select
                 name="role" // Added name and connected to state
                 value={formData.role}
                 onChange={handleChange}
                 required
                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Select Role</option> {/* Added a disabled default option */}
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="user">User</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Register
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                {/* CORRECTED: Link to /login which is more standard than /signup */}
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}