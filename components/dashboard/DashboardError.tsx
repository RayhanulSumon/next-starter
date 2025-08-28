import React from "react";

type DashboardErrorProps = {
  error: string;
  onRetry: () => void | Promise<void>;
};

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => (
  <div className="mt-20 p-6 border rounded text-center bg-white dark:bg-gray-900 text-red-700 dark:text-red-400">
    <h1 className="text-2xl font-bold mb-4">Error</h1>
    <p>{error}</p>
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={onRetry}
    >
      Retry
    </button>
  </div>
);

export default DashboardError;