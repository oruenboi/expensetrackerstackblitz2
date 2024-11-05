import React, { useState } from 'react';
import { Expense } from '../types';
import ExpenseForm from './ExpenseForm';
import { Edit, Trash2 } from 'lucide-react';
import { getCategoryColor } from '../utils/categoryColors';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string, expense: Omit<Expense, 'id'>) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
  };

  const handleUpdate = (updatedExpense: Omit<Expense, 'id'>) => {
    if (editingId) {
      onEdit(editingId, updatedExpense);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Sort expenses by date, latest first
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Expenses</h2>
      {sortedExpenses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No expenses found for the selected period.</p>
      ) : (
        <ul className="space-y-4">
          {sortedExpenses.map((expense) => (
            <li key={expense.id} className="bg-gray-50 dark:bg-gray-600 p-4 rounded shadow">
              {editingId === expense.id ? (
                <ExpenseForm onSubmit={handleUpdate} initialExpense={expense} />
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white">{expense.description}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                        aria-label="Edit expense"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Amount: ${expense.amount.toFixed(2)}</p>
                  <p className="text-gray-600 dark:text-gray-300">Date: {formatDate(expense.date)}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Category: <span style={{ color: getCategoryColor(expense.category) }}>{expense.category}</span>
                  </p>
                  {deletingId === expense.id && (
                    <div className="mt-2 bg-red-100 dark:bg-red-900 p-2 rounded">
                      <p className="text-red-800 dark:text-red-200 mb-2">Are you sure you want to delete this expense?</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={confirmDelete}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;