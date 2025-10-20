const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats
} = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.use(auth); // All routes protected

router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/stats/summary', getStats);

module.exports = router;