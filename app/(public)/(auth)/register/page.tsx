"use client";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useAuth} from "@/hook/useAuth";
import {Button} from "@/components/ui/button";
import {
    Form,
} from "@/components/ui/form";
import {CustomInputField} from "@/components/ui/CustomInputField";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { extractValidationErrors } from '@/lib/utils';

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

export default function RegisterPage() {
    return <RegisterPageContent/>;
}

function RegisterPageContent() {
    const {register} = useAuth();
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            identifier: "",
            password: "",
            password_confirmation: "",
        },
    });

    async function onSubmit(data: RegisterFormValues) {
        function isErrorWithFieldErrors(e: unknown): e is { data: { errors: Record<string, string[]> } } {
            if (typeof e !== 'object' || e === null) return false;
            const data = (e as Record<string, unknown>).data;
            if (typeof data !== 'object' || data === null) return false;
            const errors = (data as Record<string, unknown>).errors;
            return typeof errors === 'object' && errors !== null;
        }
        try {
            const payload = {
                identifier: data.identifier,
                password: data.password,
                password_confirmation: data.password_confirmation,
            };
            await register(payload);
            router.replace("/user/dashboard");
        } catch (err: unknown) {
            const allMessages = extractValidationErrors(err);
            if (isErrorWithFieldErrors(err)) {
                const errorsObj = (err as { data: { errors: Record<string, string[]> } }).data.errors;
                const fieldMap: Record<string, string> = {
                    identifier: 'identifier',
                    password: 'password',
                    password_confirmation: 'password_confirmation',
                };
                Object.entries(errorsObj).forEach(([field, messages]) => {
                    const formField = fieldMap[field] || field;
                    if (Array.isArray(messages) && messages.length > 0) {
                        form.setError(formField as keyof RegisterFormValues, { message: messages[0] });
                    }
                });
            }
            // Defensive: if no messages, show fallback
            form.setError("root", { message: allMessages.length > 0 ? allMessages.join("\n") : "Registration failed. Please try again." });
        }
    }

    return (
        <main
            className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
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
                                {form.formState.errors.root && form.formState.errors.root.message && (
                                    <div
                                        className="w-full my-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-center text-sm font-medium shadow-sm flex flex-col items-center justify-center gap-2">
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
                                        {typeof form.formState.errors.root.message === 'string' && form.formState.errors.root.message.includes('\n') ? (
                                            <ul className="list-disc list-inside text-left">
                                                {form.formState.errors.root.message.split('\n').map((msg, idx) => (
                                                    <li key={idx}>{msg}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>{form.formState.errors.root.message}</span>
                                        )}
                                    </div>
                                )}
                                <CustomInputField
                                    control={form.control}
                                    name="identifier"
                                    label="Mobile or Email"
                                    type="text"
                                    placeholder="Enter your mobile number or email"
                                    autoComplete="username"
                                />
                                <CustomInputField
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                />
                                <CustomInputField
                                    control={form.control}
                                    name="password_confirmation"
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                                <Button type="submit" className="w-full">
                                    Register
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