import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CustomInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  loading?: boolean;
  className?: string;
};

export const CustomInputField = <T extends FieldValues>({
  control,
  name,
  label,
  leftIcon,
  rightIcon,
  helperText,
  loading,
  className,
  ...rest
}: CustomInputFieldProps<T> & React.ComponentPropsWithoutRef<"input">) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && (
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[color:var(--foreground)]">{label}</span>
            </div>
          )}
          <div className="relative">
            {leftIcon && (
              <span className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-[color:var(--muted-foreground)]">
                {leftIcon}
              </span>
            )}
            <Input
              {...field}
              {...rest}
              disabled={rest.disabled || loading}
              aria-invalid={!!fieldState.error}
              aria-describedby={`${name}-helper ${name}-error`}
              className={cn(
                "text-[color:var(--input-foreground)]",
                fieldState.error ? "animate-shake border-red-500 ring-red-200" : "",
                leftIcon ? "pl-10" : "",
                rightIcon || loading ? "pr-10" : "",
                className
              )}
            />
            {rightIcon && !loading && (
              <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center text-[color:var(--muted-foreground)]">
                {rightIcon}
              </span>
            )}
            {loading && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 animate-spin text-[color:var(--primary)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </span>
            )}
          </div>
          {helperText && (
            <p id={`${name}-helper`} className="mt-1 text-xs text-[color:var(--muted-foreground)]">
              {helperText}
            </p>
          )}
          {fieldState.error && (
            <p id={`${name}-error`} className="mt-1 text-xs text-[color:var(--destructive)]">
              {fieldState.error.message}
            </p>
          )}
        </FormItem>
      )}
    />
  );
};
// Tailwind animations
// Add these to your global CSS if not present:
// .animate-shake { animation: shake 0.3s; }
// @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-4px); } 100% { transform: translateX(0); } }
// .animate-fade-in { animation: fadeIn 0.3s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }