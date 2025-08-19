"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CustomInputField } from "@/components/ui/CustomInputField";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const passwordRequirements = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "At least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "At least one lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
  { label: "At least one symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    role: z.enum([UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include a symbol"),
    password_confirmation: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: UserRole.USER,
      password: "",
      password_confirmation: "",
    },
  });

  // Redirect when authenticated
  if (user && !authLoading) {
    router.replace("/user/dashboard");
    return null;
  }

  async function onSubmit(data: RegisterFormValues) {
    try {
      await register(data);
      router.refresh();
      router.push("/user/dashboard");
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { status?: number } }).response === 'object' &&
        (err as { response?: { status?: number } }).response?.status === 429
      ) {
        form.setError("root", { message: "Too many attempts, please try again later." });
        return;
      }
      form.setError("root", {
        message: (err instanceof Error && err.message) ? err.message : "Registration failed. Please try again.",
      });
    }
  }

  // Track password for live feedback
  const passwordValue = form.watch("password");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full p-8 bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Create Account
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-600">
              Register to get started with Next Starter
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {form.formState.errors.root && (
                  <div className="w-full my-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-center text-sm font-medium shadow-sm flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                      />
                    </svg>
                    {form.formState.errors.root.message}
                  </div>
                )}
                <CustomInputField
                  control={form.control}
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  helperText="Enter your full name."
                  loading={form.formState.isSubmitting}
                />
                <CustomInputField
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm2 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
                    </svg>
                  }
                  helperText="We'll never share your email."
                  loading={form.formState.isSubmitting}
                />
                <CustomInputField
                  control={form.control}
                  name="phone"
                  label="Phone"
                  type="text"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  }
                  helperText="Enter your phone number."
                  loading={form.formState.isSubmitting}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border rounded"
                        >
                          <option value={UserRole.USER}>User</option>
                          <option value={UserRole.ADMIN}>Admin</option>
                          <option value={UserRole.SUPER_ADMIN}>
                            Super Admin
                          </option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CustomInputField
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17a5 5 0 100-10 5 5 0 000 10zm0 0v1m0-1v-1m0 1h-1m1 0h1" />
                    </svg>
                  }
                  helperText="Password must be strong."
                  loading={form.formState.isSubmitting}
                />
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req) => (
                    <div key={req.label} className={`text-xs flex items-center gap-1 ${req.test(passwordValue) ? "text-green-600" : "text-gray-400"}`}>
                      <span>{req.test(passwordValue) ? "✔" : "✗"}</span> {req.label}
                    </div>
                  ))}
                </div>
                {form.formState.errors.password && (
                  <div className="text-xs text-red-600 mt-1">{form.formState.errors.password.message}</div>
                )}
                <CustomInputField
                  control={form.control}
                  name="password_confirmation"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17a5 5 0 100-10 5 5 0 000 10zm0 0v1m0-1v-1m0 1h-1m1 0h1" />
                    </svg>
                  }
                  helperText="Re-enter your password."
                  loading={form.formState.isSubmitting}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform duration-200"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center mt-4 w-full">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}