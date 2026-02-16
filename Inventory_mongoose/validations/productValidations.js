
const sendValidationError = (res, error, duplicateMessage) => { // mongoose valdiations ans also validate duplicate ket
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  if (error.code === 11000) {
    return res.status(400).json({ error: duplicateMessage || 'Duplicate key error' });
  }
  return null;
};

const validateStockInput = (operation, quantity) => {  // validate stock
  if (!operation || typeof quantity !== 'number' || quantity < 0) {
    return 'Operation and quantity must be provided and quantity must be a positive number';
  }
  if (!['restock', 'destock'].includes(operation)) {
    return 'Operation must be either "restock" or "destock"';
  }
  return null;
};

module.exports = {
  sendValidationError,
  validateStockInput
};
