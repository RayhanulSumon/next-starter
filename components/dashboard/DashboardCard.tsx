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
        className={`bg-card text-card-foreground rounded-lg border p-6 shadow ${className}`}
      >
        <h2 className="text-card-foreground mb-4 text-lg font-medium">{title}</h2>
        {children}
      </div>
    );
  }
);

DashboardCard.displayName = "DashboardCard";

export default React.memo(DashboardCard);