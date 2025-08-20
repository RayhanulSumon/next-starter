import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
    expect(cn("foo", undefined, "baz")).toBe("foo baz");
    expect(cn("foo", { bar: true, baz: false })).toContain("foo");
  });
});

import { render, screen } from "@testing-library/react";
import DashboardCard from "../components/dashboard/DashboardCard";

describe("DashboardCard", () => {
  it("renders the title", () => {
    render(<DashboardCard title="Test Title">Content</DashboardCard>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<DashboardCard title="Title">Test Content</DashboardCard>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
