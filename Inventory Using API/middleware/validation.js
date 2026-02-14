
function validateProductCreate(req, res, next) {
  const { itemName, quantity, category } = req.body;

  if (!itemName || typeof itemName !== 'string' || itemName.trim() === '') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Item name is required and must be a non-empty string'
    });
  }

  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Quantity must be a non-negative integer'
      });
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Category must be a non-empty string'
      });
    }
  }

  req.body.itemName = itemName.trim();
  if (category) {
    req.body.category = category.trim();
  }

  next();
}

function validateProductUpdate(req, res, next) {
  const { itemName, quantity, category } = req.body;
  if (!itemName && quantity === undefined && !category) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'At least one field (itemName, quantity, or category) must be provided'
    });
  }

  if (itemName !== undefined) {
    if (typeof itemName !== 'string' || itemName.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Item name must be a non-empty string'
      });
    }
    req.body.itemName = itemName.trim();
  }

  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Quantity must be a non-negative integer'
      });
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Category must be a non-empty string'
      });
    }
    req.body.category = category.trim();
  }

  next();
}


function validateId(req, res, next) {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid ID. ID must be a positive integer'
    });
  }

  req.params.id = id;
  next();
}


function validateStockOperation(req, res, next) {
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Quantity is required'
    });
  }

  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Quantity must be a positive integer'
    });
  }

  next();
}

function validateQueryParams(req, res, next) { // filter
  const { status, category } = req.query;

  if (status) {
    const validStatuses = ['available', 'low stock', 'out of stock'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
  }
  if (category && (typeof category !== 'string' || category.trim() === '')) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Category must be a non-empty string'
    });
  }

  next();
}

module.exports = {
  validateProductCreate,
  validateProductUpdate,
  validateId,
  validateStockOperation,
  validateQueryParams
};