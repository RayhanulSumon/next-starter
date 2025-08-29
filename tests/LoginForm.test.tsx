import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../app/(public)/(auth)/login/LoginForm";

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
    login: jest.fn(),
    user: null,
    loginLoading: false,
  }),
}));

describe("LoginForm", () => {
  it("renders form fields", () => {
    render(<LoginForm onTwoFARequired={jest.fn()} />);
    expect(screen.getByPlaceholderText(/enter your email or phone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(<LoginForm onTwoFARequired={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/required|enter/i)).toBeInTheDocument();
    });
  });

  it("calls login and handles 2FA required", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ "2fa_required": true });
    jest.spyOn(require("@/hook/useAuth"), "useAuth").mockReturnValue({
      login: mockLogin,
      user: null,
      loginLoading: false,
    });
    const onTwoFARequired = jest.fn();
    render(<LoginForm onTwoFARequired={onTwoFARequired} />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email or phone/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(onTwoFARequired).toHaveBeenCalledWith("test@example.com", "Password1!");
    });
  });

  it("shows error on login failure", async () => {
    const mockLogin = jest.fn().mockRejectedValue({ message: "Invalid credentials" });
    jest.spyOn(require("@/hook/useAuth"), "useAuth").mockReturnValue({
      login: mockLogin,
      user: null,
      loginLoading: false,
    });
    render(<LoginForm onTwoFARequired={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email or phone/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});