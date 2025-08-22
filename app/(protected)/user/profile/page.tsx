import { getCurrentUser } from "@/app/actions/auth/getCurrentUser";

export default async function UserProfilePage() {
  const userResponse = await getCurrentUser();
  const user = userResponse.data;

  if (!user) {
    return (
      <div className="p-8 text-center">
        User not found or not authenticated.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="space-y-2">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email || "-"}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone || "-"}
        </div>
        <div>
          <strong>Role:</strong> {user.role}
        </div>
        <div>
          <strong>2FA Enabled:</strong> {user.two_factor_enabled ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
}