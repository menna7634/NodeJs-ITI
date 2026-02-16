const express = require('express');
const path = require('path');
const {
  readAllItems,
  saveInventory,
  getNewId,
  getItemByID,
  computeStatus,
  filterItems
} = require('./helper');

const {
  validateProductCreate,
  validateProductUpdate,
  validateId,
  validateStockOperation,
  validateQueryParams
} = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3001;


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  debugger;
  next();
});


app.get('/', (req, res) => {
  try {
    const items = readAllItems();

    const products = items.map(item => ({
      ...item,
      status: computeStatus(item.quantity)
    }));

    let totalQuantity = 0;
    let availableCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    items.forEach(item => {
      totalQuantity += item.quantity;
      const status = computeStatus(item.quantity);

      if (status === 'available') availableCount++;
      else if (status === 'low stock') lowStockCount++;
      else outOfStockCount++;
    });

    res.render('index', {
      products,
      totalItems: items.length,
      totalQuantity,
      availableCount,
      lowStockCount,
      outOfStockCount
    });

  } catch (error) {
    debugger;
    res.status(500).send('Error loading inventory');
  }
});


app.get('/products', validateQueryParams, (req, res) => { //  i can filter by status or category or without
  try {
    let items = readAllItems();
    const { status, category } = req.query;

    if (status || category) {
      items = filterItems(items, status, category);
    }

    const itemsWithStatus = items.map(item => ({
      ...item,
      status: computeStatus(item.quantity)
    }));

    res.json({
      success: true,
      count: itemsWithStatus.length,
      data: itemsWithStatus
    });

  } catch {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve products'
    });
  }
});

app.get('/products/:id', validateId, (req, res) => { // id 
  try {
    const result = getItemByID(req.params.id);

    if (!result) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Product with ID ${req.params.id} not found`
      });
    }

    res.json({
      success: true,
      data: {
        ...result.item,
        status: computeStatus(result.item.quantity)
      }
    });

  } catch {
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

app.post('/products', validateProductCreate, (req, res) => {  // create product
  try {
    const items = readAllItems();
    const { itemName, quantity = 1, category = 'General' } = req.body;

    const newItem = {
      id: getNewId(items),
      itemName,
      quantity,
      category
    };

    items.push(newItem);
    saveInventory({ items });

    res.status(201).json({
      success: true,
      data: {
        ...newItem,
        status: computeStatus(newItem.quantity)
      }
    });

  } catch {
    res.status(500).json({
      error: 'Failed to create product'
    });
  }
});

app.patch('/products/:id', validateId, validateProductUpdate, (req, res) => {  // update
  try {
    const result = getItemByID(req.params.id);

    if (!result) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const { item, items } = result;
    const { itemName, quantity, category } = req.body;

    if (itemName !== undefined) {
      item.itemName = itemName;
    }
    if (quantity !== undefined) {
      item.quantity = quantity;
    }
    if (category !== undefined) {
      item.category = category;
    }

    saveInventory({ items });

    res.json({
      success: true,
      data: {
        ...item,
        status: computeStatus(item.quantity)
      }
    });

  } catch {
    res.status(500).json({
      error: 'Failed to update product'
    });
  }
});

app.delete('/products/:id', validateId, (req, res) => { // delete
  try {
    const result = getItemByID(req.params.id);

    if (!result) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const { item, items } = result;

    const updatedItems = items.filter(i => i.id !== item.id);
    saveInventory({ items: updatedItems });

    res.json({
      success: true,
      message: `Product "${item.itemName}" deleted`
    });

  } catch {
    res.status(500).json({
      error: 'Failed to delete product'
    });
  }
});

app.post('/products/:id/restock', validateId, validateStockOperation, (req, res) => {  //id//restock
  try {
    const result = getItemByID(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { item, items } = result;
    const { quantity } = req.body;

    item.quantity += quantity;
    saveInventory({ items });

    res.json({
      success: true,
      data: {
        ...item,
        status: computeStatus(item.quantity)
      }
    });

  } catch {
    res.status(500).json({ error: 'Failed to restock product' });
  }
});

app.post('/products/:id/destock', validateId, validateStockOperation, (req, res) => { //id/destock
  try {
    const result = getItemByID(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { item, items } = result;
    const { quantity } = req.body;

    if (quantity > item.quantity) {
      return res.status(400).json({
        error: 'Not enough stock'
      });
    }

    item.quantity -= quantity;
    saveInventory({ items });

    res.json({
      success: true,
      data: {
        ...item,
        status: computeStatus(item.quantity)
      }
    });

  } catch {
    res.status(500).json({ error: 'Failed to destock product' });
  }
});


app.get('/api', (req, res) => {
  res.json({
    message: 'Inventory API',
    endpoints: ['/products', '/products/:id']
  });
});


app.use((req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.url}`
  });
});


app.listen(PORT, () => {
  debugger;
});

module.exports = app;
