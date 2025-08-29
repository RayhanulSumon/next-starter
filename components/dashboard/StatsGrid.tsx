import React from "react";
import DashboardCard from "./DashboardCard";

type Stat = { name: string; value: string };

type StatsGridProps = {
  stats: Stat[];
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <div className="grid w-full max-w-none grid-cols-1 gap-6 md:grid-cols-3">
    {stats.map((stat) => (
      <DashboardCard key={stat.name} title={stat.name} className="w-full max-w-none text-center">
        <div className="text-3xl font-semibold text-blue-600">{stat.value}</div>
      </DashboardCard>
    ))}
  </div>
);

export default StatsGrid;
