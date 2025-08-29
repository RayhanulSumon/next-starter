import React, { forwardRef } from "react";

type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const DashboardCard = forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ title, children, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-900 ${className}`}
      >
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h2>
        {children}
      </div>
    );
  }
);

DashboardCard.displayName = "DashboardCard";

export default React.memo(DashboardCard);
