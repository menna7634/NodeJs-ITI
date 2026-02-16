const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorizeProduct = require('../middlewares/authorizeProduct');
const {
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getUserProducts,
  getProducts
} = require('../controllers/productController');

router.use(auth);  // all endpoints need auth

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/user/:userId', getUserProducts);

router.patch('/:id', authorizeProduct, updateProduct);
router.patch('/:id/stock', authorizeProduct, updateStock);
router.delete('/:id', authorizeProduct, deleteProduct);

module.exports = router;