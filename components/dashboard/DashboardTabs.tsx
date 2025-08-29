import React from "react";

type DashboardTabsProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const DashboardTabs: React.FC<DashboardTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="w-full border-b border-gray-200 dark:border-gray-800">
    <nav className="-mb-px flex w-full space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={
            `border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ` +
            (activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700")
          }
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  </div>
);

export default DashboardTabs;
