"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RegisterData } from "@/types/auth";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/hook/useAuth";
import { ApiError } from "@/app/actions/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const [form, setForm] = useState<
    RegisterData & { phone: string; password_confirmation: string }
  >({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role: UserRole.USER,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.replace("/user/dashboard");
    }
  }, [user, authLoading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      router.push("/user/dashboard");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage("Registration failed"));
      } else if (err && typeof err === "object" && "response" in err) {
        setError((err as any)?.response?.data?.message || "Registration failed");
      } else if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <Card className="max-w-md w-full mx-auto p-8 bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Create Account
          </CardTitle>
          <CardDescription className="text-base md:text-lg text-gray-600">
            Register to get started with Next Starter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="font-medium">
                Role
              </Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value={UserRole.USER}>User</option>
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="font-medium">
                Confirm Password
              </Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Confirm Password"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform duration-200"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center mt-4">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login here
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
