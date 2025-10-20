import React from 'react';
import TransactionForm from './TransactionForm.jsx';
import styles from './Transactions.module.css';

const TransactionItem = ({ 
  transaction, 
  onEdit, 
  onDelete, 
  isEditing, 
  onUpdate, 
  onCancelEdit 
}) => {
  if (isEditing) {
    return (
      <div className={`${styles.transactionCard} ${transaction.type === 'income' ? styles.incomeCard : styles.expenseCard}`}>
        <TransactionForm
          initialData={transaction}
          onSubmit={onUpdate}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  const isIncome = transaction.type === 'income';
  const date = new Date(transaction.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`${styles.transactionCard} ${isIncome ? styles.incomeCard : styles.expenseCard}`}
    >
      <div className={styles.transactionIcon}>
        {isIncome ? '💵' : '💸'}
      </div>

      <div className={styles.transactionDetails}>
        <div className={styles.transactionHeader}>
          <h3>{transaction.category}</h3>
          <div
            className={`${styles.amount} ${
              isIncome ? styles.incomeAmount : styles.expenseAmount
            }`}
          >
            {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </div>
        </div>

        {transaction.description && (
          <p className={styles.description}>{transaction.description}</p>
        )}

        <div className={styles.transactionFooter}>
          <div className={styles.date}>{date}</div>
          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => onEdit(transaction.id)}
              aria-label="Edit Transaction"
            >
              ✏️ Edit
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(transaction.id)}
              aria-label="Delete Transaction"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
