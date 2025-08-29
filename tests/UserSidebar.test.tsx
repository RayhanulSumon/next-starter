import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "../app/(protected)/user/dashboard/components/UserSidebar";

jest.mock("@/hook/useAuth", () => ({
  useAuth: () => ({ user: { name: "Test User" } }),
}));

describe("UserSidebar", () => {
  it("renders Dashboard navigation item", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
  it("renders Profile navigation item", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>
    );
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });
  it("renders Examples navigation item", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>
    );
    expect(screen.getByText("Examples")).toBeInTheDocument();
  });

  it("renders user avatar with initials", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>
    );
    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  it("renders all sidebar sections", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>
    );
    // Check for header, content, and footer
    expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
  });

  it("highlights the active nav item", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>
    );
    // Find the Dashboard nav item link by its accessible name
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");
  });

  // If sidebar can be collapsed/expanded, test that functionality
  it("toggles sidebar collapse/expand if supported", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>
    );
    // Try to find a collapse/expand button
    const toggleBtn = screen.queryByRole("button", { name: /collapse|expand/i });
    if (toggleBtn) {
      fireEvent.click(toggleBtn);
      // Optionally, check for a class or attribute change
      // This is a placeholder, update as per your implementation
      expect(toggleBtn).toHaveAttribute("aria-pressed");
    }
  });
});
