import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// ...existing code...

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
              <span className="font-medium text-sm">{label}</span>
            </div>
          )}
          {/* Floating label */}
          <div className="relative">
            {leftIcon && (
              <span className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
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
                block w-full px-4 py-2 text-base bg-white border rounded-lg shadow-sm transition-all
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:bg-gray-100 disabled:cursor-not-allowed
                ${
                  fieldState.error
                    ? "border-red-500 ring-red-200 animate-shake"
                    : "border-gray-300"
                }
                  ${leftIcon ? "pl-10" : ""}
                ${rightIcon || loading ? "pr-10" : ""}
                ${className ?? ""}
              `}
            />
            {/* Floating label animation */}

            {loading && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </span>
            )}
            {rightIcon && !loading && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                {rightIcon}
              </span>
            )}
          </div>

          {/* Helper text */}
          {helperText && (
            <span
              id={`${name}-helper`}
              className="text-xs text-gray-500 mt-1 block"
            >
              {helperText}
            </span>
          )}
          {/* Error message with fade-in animation */}
          {fieldState.error?.message && (
            <span
              id={`${name}-error`}
              className="text-xs text-red-600 mt-2 block font-medium animate-fade-in"
            >
              {fieldState.error.message}
            </span>
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
