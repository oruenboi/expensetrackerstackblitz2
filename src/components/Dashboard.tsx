import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseSummary from './ExpenseSummary';
import PeriodFilter from './PeriodFilter';
import { Expense } from '../types';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);
  const [previousPeriodExpenses, setPreviousPeriodExpenses] = useState<Expense[]>([]);
  const [filterPeriod, setFilterPeriod] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const filterExpenses = useCallback(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of day

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    let filteredExpenses = expenses;
    let previousPeriodStart = new Date();
    let previousPeriodEnd = new Date();
    let currentPeriodStart = new Date();

    const filterByDateRange = (start: Date, end: Date) => {
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
    };

    switch (filterPeriod) {
      case 'thisWeek':
        filteredExpenses = filterByDateRange(startOfWeek, today);
        previousPeriodStart = new Date(startOfWeek);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        previousPeriodEnd = new Date(startOfWeek);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        currentPeriodStart = startOfWeek;
        break;
      case 'thisMonth':
        filteredExpenses = filterByDateRange(startOfMonth, today);
        previousPeriodStart = new Date(startOfMonth);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        previousPeriodEnd = new Date(startOfMonth);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        currentPeriodStart = startOfMonth;
        break;
      case 'thisYear':
        filteredExpenses = filterByDateRange(startOfYear, today);
        previousPeriodStart = new Date(startOfYear);
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
        previousPeriodEnd = new Date(startOfYear);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        currentPeriodStart = startOfYear;
        break;
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        filteredExpenses = filterByDateRange(sevenDaysAgo, today);
        previousPeriodStart = new Date(sevenDaysAgo);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        previousPeriodEnd = new Date(sevenDaysAgo);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        currentPeriodStart = sevenDaysAgo;
        break;
      // ... (similar changes for other cases)
      case 'custom':
        if (customStartDate && customEndDate) {
          const startDate = new Date(customStartDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
          filteredExpenses = filterByDateRange(startDate, endDate);
          const duration = endDate.getTime() - startDate.getTime();
          previousPeriodStart = new Date(startDate.getTime() - duration);
          previousPeriodEnd = new Date(startDate.getTime() - 1);
          currentPeriodStart = startDate;
        }
        break;
      default:
        filteredExpenses = expenses;
        previousPeriodStart = new Date(0); // Beginning of time
        previousPeriodEnd = new Date(0);
        currentPeriodStart = new Date(0);
    }

    setFilteredExpenses(filteredExpenses);
    setPreviousPeriodExpenses(filterByDateRange(previousPeriodStart, previousPeriodEnd));
  }, [expenses, filterPeriod, customStartDate, customEndDate]);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses, expenses, filterPeriod, customStartDate, customEndDate]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  const editExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses(prevExpenses => prevExpenses.map(expense => 
      expense.id === id ? { ...updatedExpense, id } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expense Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add Expense</h2>
          <ExpenseForm onSubmit={addExpense} />
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Filter Expenses</h2>
          <PeriodFilter
            filterPeriod={filterPeriod}
            setFilterPeriod={setFilterPeriod}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
          />
        </div>
      </div>
      <ExpenseSummary 
        expenses={filteredExpenses} 
        previousPeriodExpenses={previousPeriodExpenses}
        filterPeriod={filterPeriod}
      />
      <ExpenseList
        expenses={filteredExpenses}
        onEdit={editExpense}
        onDelete={deleteExpense}
      />
    </div>
  );
};

export default Dashboard;