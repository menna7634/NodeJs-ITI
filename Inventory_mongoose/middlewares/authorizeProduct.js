const Product = require('../models/Product');

const authorizeProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isAdmin = req.userRole === 'admin';
    const isOwner = product.owner.toString() === req.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.product = product;
    next();
  } catch {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
};

module.exports = authorizeProduct;
