const Product = require('../models/Product');
const { sendValidationError, validateStockInput } = require('../validations/productValidations');

exports.createProduct = async (req, res) => {
  try {
    const { name, categories, quantity } = req.body;
    const product = new Product({ owner: req.userId, name, categories, quantity });
    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    if (sendValidationError(res, error, 'Product name already exists for this user')) return;
    res.status(500).json({ error: 'Server error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    const product = req.product;

    ['_id', 'productId', 'owner', 'createdAt', 'updatedAt'].forEach(f => delete updates[f]);

    Object.keys(updates).forEach(key => (product[key] = updates[key]));
    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    if (sendValidationError(res, error, 'Product name already exists for this user')) return;
    res.status(500).json({ error: 'Server error updating product' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { operation, quantity } = req.body;
    const product = req.product;

    const validationError = validateStockInput(operation, quantity);
    if (validationError) return res.status(400).json({ error: validationError });

    if (operation === 'restock') product.quantity += quantity;
    if (operation === 'destock') product.quantity = Math.max(0, product.quantity - quantity);

    await product.save();
    res.json({ message: `Product ${operation}ed successfully`, product });
  } catch {
    res.status(500).json({ error: 'Server error updating stock' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = req.product;
    await Product.findByIdAndDelete(product._id);

    res.json({ message: 'Product deleted successfully', deletedProduct: product });
  } catch {
    res.status(500).json({ error: 'Server error deleting product' });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.params.userId })
      .populate('owner', 'firstName lastName username')
      .sort({ createdAt: -1 });

    res.json({ count: products.length, products });
  } catch (error) {
    if (error.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid user ID' });
    res.status(500).json({ error: 'Server error fetching products' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let { limit = 10, skip = 0, status } = req.query;
    limit = parseInt(limit);
    skip = parseInt(skip);

    let products = await Product.find()
      .populate('owner', 'firstName lastName username')
      .sort({ createdAt: -1 });

    const total = products.length;
    const paginatedProducts = products.slice(skip, skip + limit);

    res.json({
      count: paginatedProducts.length,
      total,
      limit,
      skip,
      ...(status && { status }),
      products: paginatedProducts
    });
  } catch {
    res.status(500).json({ error: 'Server error fetching products' });
  }
};
