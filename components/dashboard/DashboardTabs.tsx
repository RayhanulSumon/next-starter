import React from "react";

type DashboardTabsProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const DashboardTabs: React.FC<DashboardTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200 dark:border-gray-800 w-full">
    <nav className="-mb-px flex space-x-8 w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={
            `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ` +
            (activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")
          }
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  </div>
);

export default DashboardTabs;