"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RegisterData } from '@/types/auth';
import { UserRole } from '@/types/auth';
import { useAuth } from "@/hook/useAuth";
import { ApiError } from "@/app/actions/shared";

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const [form, setForm] = useState<RegisterData & { phone: string; password_confirmation: string }>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            if (err && typeof err === 'object' && 'response' in err) {
                setError((err as any)?.response?.data?.message || "Registration failed");
            } else {
                setError("Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
            {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}