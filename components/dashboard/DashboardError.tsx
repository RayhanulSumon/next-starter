import React from "react";

type DashboardErrorProps = {
  error: string;
  onRetry: () => void | Promise<void>;
};

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => (
  <div className="mt-20 rounded border bg-white p-6 text-center text-red-700 dark:bg-gray-900 dark:text-red-400">
    <h1 className="mb-4 text-2xl font-bold">Error</h1>
    <p>{error}</p>
    <button
      className="mt-4 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      onClick={onRetry}
    >
      Retry
    </button>
  </div>
);

export default DashboardError;
