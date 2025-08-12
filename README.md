# Next.js Authentication Starter with Role-Based Access

A complete authentication starter kit for Next.js applications with TypeScript, featuring role-based access control, email/phone authentication, and a clean, modern UI.

## Features

- **Multi-factor Authentication**
  - Login with email or phone number
  - Secure password handling with proper hashing
  - JWT-based token authentication

- **Role-Based Access Control**
  - Three predefined roles: `user`, `admin`, and `super-admin`
  - Type-safe role management with TypeScript enums
  - Role-specific UI components and routes

- **User Management**
  - User registration with validation
  - Profile management
  - Password reset functionality (email link and phone code)

- **Modern Architecture**
  - Next.js App Router
  - React Context for global state management
  - Axios for API communication
  - TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Laravel backend with the appropriate authentication endpoints

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/next-starter.git
   cd next-starter
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

This starter is designed to work with a Laravel backend API that provides the following endpoints:

- `POST /api/loginAction` - User loginAction with email/phone
- `POST /api/registerAction` - New user registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user
- `POST /api/request-password-reset` - Request password reset
- `POST /api/reset-password` - Reset password with token/code

## Role-Based Access

This starter implements three user roles:

1. **User** (`UserRole.USER`) - Regular users with basic access
2. **Admin** (`UserRole.ADMIN`) - Administrative users with elevated permissions
3. **Super Admin** (`UserRole.SUPER_ADMIN`) - Top-level administrators with full access

You can extend this system by adding more roles or permissions as needed.

## Project Structure

```
├── app/                  # Next.js pages and routing
│   ├── dashboard/        # Protected dashboard page
│   ├── loginAction/            # Login page
│   ├── registerAction/         # Registration page
├── context/              # React contexts
│   ├── auth-context.tsx  # Authentication context
├── hook/                 # Custom React hooks
│   ├── axiosClient.ts    # API client configuration
│   ├── useAuth.ts        # Authentication hook
├── types/                # TypeScript type definitions
│   ├── auth.ts           # Auth-related types and enums
```

## Customization

### Adding New Routes

To add a new protected route, create a new folder in the `app` directory and use the `useAuth` hook to check authentication status.

### Adding New Roles

To add a new user role:

1. Update the `UserRole` enum in `types/auth.ts`
2. Add the new role to the dropdown in the registration form
3. Update your backend to support the new role

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)