// Centralized API error extraction and normalization helpers

export function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

// Extracts all validation error messages from an error object (Axios, ApiError, or plain)
export function extractValidationErrors(error: unknown): string[] {
  let errors: unknown = null;
  let message: string | undefined = undefined;
  if (isObject(error)) {
    // Top-level errors (from server action error: { message, errors, status })
    if ("errors" in error) {
      errors = (error as Record<string, unknown>).errors;
    }
    // ApiError or plain error with data.errors
    else if ("data" in error && isObject(error.data) && "errors" in error.data) {
      errors = (error.data as Record<string, unknown>).errors;
    }
    // Axios-style error
    else if (
      "response" in error &&
      isObject(error.response) &&
      "data" in error.response &&
      isObject(error.response.data) &&
      "errors" in error.response.data
    ) {
      errors = (error.response.data as Record<string, unknown>).errors;
    }
    // Also extract message if present
    if ("message" in error && typeof error.message === "string" && error.message) {
      message = error.message;
    } else if (
      "data" in error &&
      isObject(error.data) &&
      "message" in error.data &&
      typeof error.data.message === "string" &&
      error.data.message
    ) {
      message = error.data.message;
    } else if (
      "response" in error &&
      isObject(error.response) &&
      "data" in error.response &&
      isObject(error.response.data) &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string" &&
      error.response.data.message
    ) {
      message = error.response.data.message;
    }
  }
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.map(String);
  }
  if (isObject(errors)) {
    // Flatten all string[] values from the errors object
    const flat = Object.values(errors).flatMap((v) =>
      Array.isArray(v) ? v.map(String) : [String(v)]
    );
    if (flat.length > 0) return flat;
  }
  // If no errors, but message exists, return it as array
  if (message) return [message];
  return [];
}

// Type guard for error object with field errors
export function isApiErrorWithFieldErrors(
  e: unknown
): e is { data: { errors: Record<string, string[]> } } {
  if (!isObject(e)) return false;
  const data = (e as Record<string, unknown>).data;
  if (!isObject(data)) return false;
  const errors = (data as Record<string, unknown>).errors;
  return isObject(errors);
}

// Optionally, get errors for a specific field
export function getFieldErrors(error: unknown, field: string): string[] {
  if (isApiErrorWithFieldErrors(error)) {
    const errorsObj = (error as { data: { errors: Record<string, string[]> } }).data.errors;
    if (field in errorsObj && Array.isArray(errorsObj[field])) {
      return errorsObj[field];
    }
  }
  return [];
}

// Extract user from API response
export function extractUserFromApiResponse<T extends { user?: unknown }>(
  result: unknown
): T["user"] | null {
  if (
    typeof result === "object" &&
    result !== null &&
    "data" in result &&
    typeof (result as Record<string, unknown>).data === "object" &&
    (result as Record<string, unknown>).data !== null
  ) {
    const data = (result as Record<string, unknown>).data;
    if (isObject(data) && "user" in data) {
      return (data as { user?: T["user"] }).user ?? null;
    }
  }
  return null;
}