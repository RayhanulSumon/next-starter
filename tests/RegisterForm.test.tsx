import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../app/(public)/(auth)/register/page";

// Mock useAuth at the top level
let mockAuthState: any;
jest.mock("@/hook/useAuth", () => ({
  useAuth: () => mockAuthState,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

function getMockAuthState(overrides = {}) {
  return {
    user: null,
    loginLoading: false,
    registerLoading: false,
    resetLoading: false,
    requestResetLoading: false,
    initialLoading: false,
    error: null,
    setUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
    fetchCurrentUser: jest.fn(),
    resetAuthState: jest.fn(),
    clearError: jest.fn(),
    ...overrides,
  };
}

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState = getMockAuthState();
  });

  it("renders form fields", () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText(/enter your mobile number or email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^enter your password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/required|enter/i)).toBeInTheDocument();
    });
  });

  it("shows error if passwords do not match", async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your mobile number or email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^enter your password$/i), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: "Password2!" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("shows error for duplicate email/phone", async () => {
    const mockRegister = jest.fn().mockRejectedValue({
      data: { errors: { identifier: ["The email has already been taken."] } }
    });
    mockAuthState = getMockAuthState({ register: mockRegister });
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your mobile number or email/i), { target: { value: "duplicate@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^enter your password$/i), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      // Try to find the error message near the identifier input
      const error = screen.queryByText((content) => content.includes("already been taken"));
      expect(error).toBeInTheDocument();
    });
  });

  it("shows error for weak password (backend)", async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your mobile number or email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^enter your password$/i), { target: { value: "weakpass" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: "weakpass" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
    });
  });

  it("shows error for invalid email/phone format (frontend)", async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your mobile number or email/i), { target: { value: "notanemail" } });
    fireEvent.change(screen.getByPlaceholderText(/^enter your password$/i), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email or mobile/i)).toBeInTheDocument();
    });
  });

  it("shows error for password missing required types (frontend)", async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your mobile number or email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^enter your password$/i), { target: { value: "password" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/uppercase|number|symbol/i)).toBeInTheDocument();
    });
  });

  it("shows root error for generic server error", async () => {
    const mockRegister = jest.fn().mockRejectedValue(new Error("Server error!"));
    mockAuthState = getMockAuthState({ register: mockRegister });
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your mobile number or email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^enter your password$/i), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      // Try to find the error message in any alert or error container
      const error = screen.queryByText((content) => content.toLowerCase().includes("server error"));
      expect(error).toBeInTheDocument();
    });
  });

  it("registers successfully", async () => {
    const mockRegister = jest.fn().mockResolvedValue({});
    mockAuthState = getMockAuthState({ register: mockRegister });
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter your mobile number or email/i), { target: { value: "success@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^enter your password$/i), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });
});