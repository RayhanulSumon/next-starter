import React from "react";
import { User, UserRole } from "@/types/auth-types";

type UserInfoCardProps = {
  user: User;
};

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => (
  <div className="space-y-2">
    <p>
      <span className="font-medium">Name:</span> {user.name}
    </p>
    <p>
      <span className="font-medium">Email:</span> {user.email || "Not provided"}
    </p>
    <p>
      <span className="font-medium">Phone:</span> {user.phone || "Not provided"}
    </p>
    <p>
      <span className="font-medium">Role:</span> {user.role || UserRole.USER}
    </p>
  </div>
);

export default UserInfoCard;
