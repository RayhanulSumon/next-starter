import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type CustomInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  loading?: boolean;
};

export const CustomInputField = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
  className,
  leftIcon,
  rightIcon,
  helperText,
  loading,
}: CustomInputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {/* Label position logic */}
          {label && (
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {label}
              </span>
            </div>
          )}
          {/* Floating label */}
          <div className="relative">
            {leftIcon && (
              <span className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                {leftIcon}
              </span>
            )}
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled || loading}
              aria-invalid={!!fieldState.error}
              aria-describedby={`${name}-helper ${name}-error`}
              className={`
                block w-full px-4 py-2 text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border rounded-lg shadow-sm transition-all
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                ${
                  fieldState.error
                    ? "border-red-500 ring-red-200 animate-shake"
                    : "border-gray-300 dark:border-gray-700"
                }
                  ${leftIcon ? "pl-10" : ""}
                ${rightIcon || loading ? "pr-10" : ""}
                ${className ?? ""}
              `}
            />
            {rightIcon && !loading && (
              <span className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                {rightIcon}
              </span>
            )}
            {loading && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
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
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              </span>
            )}
          </div>
          {helperText && (
            <p
              id={`${name}-helper`}
              className="mt-1 text-xs text-gray-600 dark:text-gray-400"
            >
              {helperText}
            </p>
          )}
          {fieldState.error && (
            <p
              id={`${name}-error`}
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
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