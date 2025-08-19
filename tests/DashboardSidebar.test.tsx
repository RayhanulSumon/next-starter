import { render, screen } from '@testing-library/react';
import { SidebarProvider } from '../components/ui/sidebar';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

describe('DashboardSidebar', () => {
  it('renders Dashboard navigation item', () => {
    render(
      <SidebarProvider>
        <DashboardSidebar />
      </SidebarProvider>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
  it('renders Profile navigation item', () => {
    render(
      <SidebarProvider>
        <DashboardSidebar />
      </SidebarProvider>
    );
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
  it('renders Activity navigation item', () => {
    render(
      <SidebarProvider>
        <DashboardSidebar />
      </SidebarProvider>
    );
    expect(screen.getByText('Activity')).toBeInTheDocument();
  });
});