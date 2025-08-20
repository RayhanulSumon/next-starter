import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Public layout header, nav, etc. */}
      {children}
    </div>
  );
}
