"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomInputField } from "@/components/ui/CustomInputField";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { extractValidationErrors, getFieldErrors } from "@/lib/apiErrorHelpers";

const REGISTER_FIELDS = ["identifier", "password", "password_confirmation"] as const;
const identifierSchema = z.string().refine(
  (val) => {
    // Basic email or phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return emailRegex.test(val) || phoneRegex.test(val);
  },
  {
    message: "Enter a valid email or mobile number",
  }
);

const registerSchema = z
  .object({
    identifier: identifierSchema,
    password: z
      .string()
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

function RootError({ message }: { message?: string }) {
  if (!message) return null;
  // Memoize split errors for performance (micro-optimization)
  const errorLines = message.includes("\n") ? message.split("\n") : null;
  return (
    <div
      className="my-2 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-[color:var(--destructive)] bg-[color:var(--destructive)/0.1] px-4 py-3 text-center text-sm font-medium text-[color:var(--destructive)] shadow-sm"
      role="alert"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-[color:var(--destructive)]"
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
      {errorLines ? (
        <ul className="list-inside list-disc text-left">
          {errorLines.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      ) : (
        <span>{message}</span>
      )}
    </div>
  );
}

const FIELD_CONFIG = [
  {
    name: "identifier",
    label: "Mobile or Email",
    type: "text",
    placeholder: "Enter your mobile number or email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "new-password",
  },
  {
    name: "password_confirmation",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    autoComplete: "new-password",
  },
] as const;

function setApiFieldErrors<T extends string>(
  form: UseFormReturn<RegisterFormValues>,
  error: unknown,
  fields: readonly T[]
) {
  fields.forEach((field) => {
    const messages = getFieldErrors(error, field as keyof RegisterFormValues);
    if (messages && messages.length > 0) {
      form.setError(field as keyof RegisterFormValues, { message: messages[0] });
    }
  });
}

function useRegisterForm(onSuccess: () => void) {
  const { register } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      identifier: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data);
      onSuccess();
    } catch (error) {
      setApiFieldErrors(form, error, REGISTER_FIELDS);
      const errors = extractValidationErrors(error);
      form.setError("root", {
        message: errors.length > 0 ? errors.join("\n") : "Registration failed. Please try again.",
      });
    }
  };

  return { form, handleSubmit };
}

export default function RegisterPage() {
  const router = useRouter();
  const { form, handleSubmit } = useRegisterForm(() => router.replace("/user/dashboard"));

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-foreground mb-2 text-3xl font-extrabold md:text-4xl">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base md:text-lg">
              Register to get started with Next Starter
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <RootError message={form.formState.errors.root?.message} />
                {FIELD_CONFIG.map(({ name, label, type, placeholder, autoComplete }) => (
                  <CustomInputField
                    key={name}
                    control={form.control}
                    name={name}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                  />
                ))}
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="mt-4 flex w-full justify-center">
            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="primary-link font-medium hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}