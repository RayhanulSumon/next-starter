import React from "react";
import DashboardCard from "./DashboardCard";

type Stat = { name: string; value: string };

type StatsGridProps = {
  stats: Stat[];
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-none">
    {stats.map((stat) => (
      <DashboardCard
        key={stat.name}
        title={stat.name}
        className="text-center w-full max-w-none"
      >
        <div className="text-3xl font-semibold text-blue-600">
          {stat.value}
        </div>
      </DashboardCard>
    ))}
  </div>
);

export default StatsGrid;