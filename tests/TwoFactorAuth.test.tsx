import { render, screen } from "@testing-library/react";
import TwoFactorAuth from "../components/dashboard/TwoFactorAuth";

jest.mock("../hook/useAuth", () => ({
  useAuth: () => ({ user: { two_factor_enabled: false } }),
}));

describe("TwoFactorAuth", () => {
  it("renders the 2FA heading", () => {
    render(<TwoFactorAuth />);
    expect(screen.getByText("Two-Factor Authentication (2FA)")).toBeInTheDocument();
  });
  it("renders Enable 2FA button when 2FA is disabled", () => {
    render(<TwoFactorAuth />);
    expect(screen.getByText("Enable 2FA")).toBeInTheDocument();
  });
});
