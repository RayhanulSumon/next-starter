import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidebarProvider } from '../components/ui/sidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';

describe('DashboardTopbar', () => {
  it('renders the User Dashboard heading', () => {
    render(
      <SidebarProvider>
        <DashboardTopbar />
      </SidebarProvider>
    );
    expect(screen.getByText('User Dashboard')).toBeInTheDocument();
  });
  it('renders Profile, Settings, and Logout menu items', async () => {
    render(
      <SidebarProvider>
        <DashboardTopbar />
      </SidebarProvider>
    );
    // Open the dropdown menu
    const triggerButton = screen.getByRole('button', { name: '' }); // fallback: get by data attribute
    // Prefer querySelector for data-slot if available
    const dropdownTrigger = document.querySelector('[data-slot="dropdown-menu-trigger"]');
    await userEvent.click(dropdownTrigger || triggerButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});