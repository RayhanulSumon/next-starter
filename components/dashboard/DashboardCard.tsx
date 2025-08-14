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
        className={`bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800 ${className}`}
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h2>
        {children}
      </div>
    );
  }
);

DashboardCard.displayName = "DashboardCard";

export default React.memo(DashboardCard);
