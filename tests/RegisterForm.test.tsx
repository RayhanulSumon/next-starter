import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../app/(public)/(auth)/register/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock useAuth hook
jest.mock("@/hook/useAuth", () => ({
  useAuth: () => ({
    register: jest.fn(),
    user: null,
    registerLoading: false,
  }),
}));

describe("RegisterPage", () => {
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

  // Add more tests for password rules, success, and error cases as needed
});