const User = require('../models/User');
const Product = require('../models/Product');
const createAuthenticationToken = require('../helpers/createAuthenticationToken');
const {
  sendValidationError,
  validateRegistrationInput,
  validateLoginInput,
  filterUpdateFields
} = require('../validations/userValidations');

exports.registerUser = async (req, res) => {
  try {
    const errors = validateRegistrationInput(req.body);
    if (errors) return res.status(400).json({ error: 'Validation failed', details: errors });

    const { username, password, firstName, lastName, dob } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username, password, firstName, lastName, dob });
    await user.save();

    const token = createAuthenticationToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.log(error);
    if (sendValidationError(res, error, 'Username already exists')) return;
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createAuthenticationToken(user);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('firstName username userId');
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.userId.toString() !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You can only delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await Product.deleteMany({ owner: userId });

    res.json({ message: 'User deleted successfully', deletedUser: user.toJSON() });
  } catch (error) {
    if (error.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid user ID' });
    res.status(500).json({ error: 'Server error deleting user' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let updates = filterUpdateFields(req.body);

    if (req.userId.toString() !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You can only edit your own account' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    Object.keys(updates).forEach(key => (user[key] = updates[key]));
    await user.save();    // pree save 

    res.json({ message: 'User was edited successfully', user: user.toJSON() });
  } catch (error) {
    if (sendValidationError(res, error, 'Username already exists')) return;
    if (error.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid user ID' });
    res.status(500).json({ error: 'Server error updating user' });
  }
};
