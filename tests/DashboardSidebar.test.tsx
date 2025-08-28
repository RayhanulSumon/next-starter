import { render, screen } from "@testing-library/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "../app/(protected)/user/dashboard/components/UserSidebar";

describe("UserSidebar", () => {
  it("renders Dashboard navigation item", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>,
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
  it("renders Profile navigation item", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>,
    );
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });
  it("renders Activity navigation item", () => {
    render(
      <SidebarProvider>
        <UserSidebar />
      </SidebarProvider>,
    );
    expect(screen.getByText("Activity")).toBeInTheDocument();
  });
});