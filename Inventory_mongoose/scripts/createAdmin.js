require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

// some validations
const validateUsername = (username) => username.length >= 8;
const validatePassword = (password) => password.length >= 6;
const validateName = (name) => name.length >= 3 && name.length <= 15;

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const username = await ask('Enter username (min 8 characters): ');
    if (!validateUsername(username)) throw new Error('Username must be at least 8 characters');

    const password = await ask('Enter password (min 6 characters): ');
    if (!validatePassword(password)) 
        throw new Error('Password must be at least 6 characters');

    const firstName = await ask('Enter first name (3-15 characters): ');
    if (!validateName(firstName)) 
        throw new Error('First name must be 3-15 characters');

    const lastName = await ask('Enter last name (3-15 characters): ');
    if (!validateName(lastName)) 
        throw new Error('Last name must be 3-15 characters');

    let user = await User.findOne({ username });

    if (user) {
      console.log('\n User already exists. Updating role to admin...');
      user.role = 'admin';
      await user.save();
      console.log('User updated to admin successfully!');
    } else {
      user = new User({ username, password, firstName, lastName, role: 'admin' });
      await user.save();
      console.log('\nAdmin user created successfully!');
    }

    console.log('User Details:', {
      userId: user.userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });

    rl.close();
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('\nError:', error.message);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdminUser();
