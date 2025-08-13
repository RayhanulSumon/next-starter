
import React, { forwardRef } from "react";

type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const DashboardCard = forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ title, children, className = "" }, ref) => {
    return (
      <div ref={ref} className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
        {children}
      </div>
    );
  }
);

DashboardCard.displayName = "DashboardCard";

export default React.memo(DashboardCard);
