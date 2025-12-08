"use client";

import { register, login } from "@/services/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { setUser } = useAuthContext() as any; // Type assertion to avoid TS error
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!role) {
      toast.error("Please select a role!");
      return;
    }

    try {
      const res = await register(firstName, lastName, email, password, role);
      toast.success("Registration successful!");
      localStorage.setItem("token", res.token);
      setUser(res.user);
      router.push("/welcome");
    } catch (e: any) {
      const errorMsg = e.response?.data?.msg || "Registration failed";
      toast.error(errorMsg);
      if (process.env.NODE_ENV !== "production") {
        console.error("Registration failed:", e);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    try {
      const res = await login(email, password, "user");
      toast.success("Login successful!");
      localStorage.setItem("token", res.token);
      setUser(res.user);
      router.push("/welcome");
    } catch (e: any) {
      const errorMsg = e.response?.data?.msg || "Login failed";
      toast.error(errorMsg);
      if (process.env.NODE_ENV !== "production") {
        console.error("Login failed:", e);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-800">
            {isRegistering ? "Register" : "Login"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={isRegistering ? handleRegister : handleLogin}
            className="space-y-5"
          >
            {isRegistering && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                  <option value="user">User</option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isRegistering ? "Register" : "Login"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {isRegistering ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setIsRegistering(false)}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Do not have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setIsRegistering(true)}
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}