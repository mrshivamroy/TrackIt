import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api.js';
import TransactionForm from './TransactionForm.jsx';
import TransactionItem from './TransactionItem.jsx';
import styles from './Transactions.module.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(t =>
        t.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(t =>
        new Date(t.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(t =>
        new Date(t.date) <= new Date(filters.endDate)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = async (data) => {
    try {
      await api.createTransaction(data);
      fetchTransactions();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (id, data) => {
    try {
      await api.updateTransaction(id, data);
      fetchTransactions();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.deleteTransaction(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  return (
    <div className={styles.transactionsContainer}>
      <div className={styles.header}>
        <h1>Transactions</h1>
        <button
          className={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditingTransaction(null); // Close edit when toggling form
          }}
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className={styles.filters}>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className={styles.filterInput}
        />

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className={styles.filterInput}
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className={styles.filterInput}
        />

        <button
          onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '' })}
          className={styles.clearBtn}
        >
          Clear Filters
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} role="img" aria-label="empty">📊</div>
          <p>No transactions found</p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingTransaction(null);
            }}
            className={styles.emptyBtn}
          >
            Add Your First Transaction
          </button>
        </div>
      ) : (
        <div className={styles.transactionsList}>
          {filteredTransactions.map(transaction => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              onEdit={() => {
                setEditingTransaction(transaction);
                setShowForm(false);
              }}
              onDelete={() => handleDeleteTransaction(transaction._id)}
              isEditing={editingTransaction?._id === transaction._id}
              onUpdate={handleUpdateTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
          ))}
        </div>
      )}

      {/* Show edit form if editing */}
      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleUpdateTransaction}
          onCancel={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionList;
