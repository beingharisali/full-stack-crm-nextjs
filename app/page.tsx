"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Users } from "lucide-react";

export default function Home() {
  const { loginUser, registerUser } = useAuthContext();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      await registerUser(firstName, lastName, email, password, role as any);
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
      await loginUser(email, password, role as any);
    } catch (e: any) {
      // Extract error message from different possible sources
      let errorMsg = "Login failed";
      
      if (e.response?.data?.msg) {
        errorMsg = e.response.data.msg;
      } else if (e.response?.data?.message) {
        errorMsg = e.response.data.message;
      } else if (e.message) {
        errorMsg = e.message;
      }
      
      toast.error(errorMsg);
      
      if (process.env.NODE_ENV !== "production") {
        console.error("Login failed:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl bg-white/95 backdrop-blur-lg border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-blue-100 mt-2">
              {isRegistering
                ? "Join us today and get started"
                : "Sign in to continue your journey"}
            </p>
          </div>
          
          <CardHeader className="pt-6 pb-2">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              {isRegistering ? "Sign Up" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isRegistering
                ? "Enter your information to create an account"
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <form
              onSubmit={isRegistering ? handleRegister : handleLogin}
              className="space-y-4"
            >
              {isRegistering && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Full Name
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Input
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {isRegistering && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Role
                </label>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 rounded-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isRegistering ? "Create Account" : "Sign In"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isRegistering ? "Already have an account?" : "New to our platform?"}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                >
                  {isRegistering ? "Sign In Instead" : "Create an Account"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-white/80">
          <p className="text-sm">© 2023 CRM System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}