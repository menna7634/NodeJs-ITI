

const sendValidationError = (res, error, duplicateMessage) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  if (error.code === 11000) {
    return res.status(400).json({ error: duplicateMessage || 'Duplicate key error' });
  }
  return null;
};


const validateRegistrationInput = ({ username, password, firstName, lastName, dob }) => {
  const errors = [];
  if (!username) errors.push('Username is required');
  if (!password) errors.push('Password is required');
  if (!firstName) errors.push('First name is required');
  if (!lastName) errors.push('Last name is required');
  return errors.length ? errors : null;
};

const validateLoginInput = ({ username, password }) => {
  if (!username || !password) {
    return 'Username and password are required';
  }
  return null;
};

const filterUpdateFields = (updates) => { // validate update fields 
  const forbiddenFields = ['_id', 'userId', 'createdAt', 'updatedAt', 'role'];
  forbiddenFields.forEach(f => delete updates[f]);
  return updates;
};

module.exports = {
  sendValidationError,
  validateRegistrationInput,
  validateLoginInput,
  filterUpdateFields
};
