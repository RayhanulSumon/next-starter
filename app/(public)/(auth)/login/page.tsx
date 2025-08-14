"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
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

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user, loginLoading, loading: authLoading } = useAuth();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Redirect when authenticated
  if (user && !authLoading) {
    router.replace("/user/dashboard");
    return null;
  }

  async function onSubmit(data: LoginFormValues) {
    try {
      await login(data.identifier, data.password);
      router.push("/user/dashboard");
    } catch (err: unknown) {
      form.setError("root", {
        message: "Credentials do not match our records",
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full p-8 bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-600">
              Sign in to your account to continue
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
                  name="identifier"
                  label="Email or Phone"
                  type="text"
                  placeholder="Enter your email or phone"
                  autoComplete="username"
                  disabled={loginLoading}
                  leftIcon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                  helperText="Use your registered email or phone."
                  loading={loginLoading}
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Password</span>
                    <Link
                      href="/reset-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <CustomInputField
                    control={form.control}
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loginLoading}
                    leftIcon={
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 17a5 5 0 100-10 5 5 0 000 10zm0 0v1m0-1v-1m0 1h-1m1 0h1"
                        />
                      </svg>
                    }
                    helperText="Enter your account password."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform duration-200"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center mt-4 w-full">
            <p className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
