import { ApiError } from "@/lib/api";

export function getFieldError(error: ApiError, field: string): string | null {
  if (typeof error.body !== "object" || !error.body) return null;
  const value = (error.body as Record<string, unknown>)[field];
  if (Array.isArray(value) && value.length > 0) {
    return String(value[0]);
  }
  if (typeof value === "string") return value;
  return null;
}

export function getApiErrorMessage(error: ApiError, field?: string): string {
  if (field) {
    const fieldError = getFieldError(error, field);
    if (fieldError) return fieldError;
  }
  if (typeof error.body === "object" && error.body) {
    const body = error.body as Record<string, unknown>;
    const nonField = body.non_field_errors;
    if (Array.isArray(nonField) && nonField.length > 0) {
      return String(nonField[0]);
    }
    for (const [key, value] of Object.entries(body)) {
      if (key === "detail") continue;
      if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
      }
    }
  }
  return error.message;
}
