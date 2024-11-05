import React from 'react';

interface PeriodFilterProps {
  filterPeriod: string;
  setFilterPeriod: (period: string) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  filterPeriod,
  setFilterPeriod,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Filter Expenses</h2>
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="px-3 py-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
        >
          <option value="all">All Time</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
          <option value="7days">Last 7 Days</option>
          <option value="14days">Last 14 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="60days">Last 60 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastYear">Last Year</option>
          <option value="custom">Custom Period</option>
        </select>
        {filterPeriod === 'custom' && (
          <>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
            />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodFilter;