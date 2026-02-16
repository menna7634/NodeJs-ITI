
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    registerUser,
    loginUser,
    getAllUsers,
    deleteUser,
    updateUser
} = require('../controllers/userController');


const {
    getUserProducts
} = require('../controllers/productController')

// public routes
router.post('/', registerUser);
router.post('/login', loginUser);

//protected routes
router.get('/', auth, getAllUsers);
router.delete('/:id', auth, deleteUser);
router.patch('/:id', auth, updateUser);

router.get('/:userId/products', auth, getUserProducts);


module.exports = router;
