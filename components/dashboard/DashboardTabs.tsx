import React from "react";

type DashboardTabsProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const DashboardTabs: React.FC<DashboardTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="w-full border-b">
    <nav className="-mb-px flex w-full space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={
            `border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ` +
            (activeTab === tab
              ? "border-primary text-primary"
              : "text-muted-foreground hover:border-muted hover:text-foreground border-transparent")
          }
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  </div>
);

export default DashboardTabs;