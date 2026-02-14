const fs = require('fs');
const path = require('path');

const inventoryFilePath = path.join(__dirname, 'inventory.json');

function readAllItems() {
  try {
    const fileContent = fs.readFileSync(inventoryFilePath, "utf8");
    return JSON.parse(fileContent).items;
  } catch {
    fs.writeFileSync(inventoryFilePath, JSON.stringify({ items: [] }));
    return [];
  }
}

function saveInventory(inventory) {
  try {
    fs.writeFileSync(inventoryFilePath, JSON.stringify(inventory, null, 2));
  } catch (error) {
    console.error('Error saving inventory:', error.message);
    throw error;
  }
}

function getNewId(items) {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map(item => item.id)) + 1;
}

function getItemByID(id) {
  const items = readAllItems();
  const item = items.find(item => item.id === id);

  if (!item) {
    return null;
  }

  return { item, items };
}

function computeStatus(quantity) {
  if (quantity > 2) {
    return "available";
  } else if (quantity > 0) {
    return "low stock";
  } else {
    return "out of stock";
  }
}
function filterItems(items, status, category) {
  let filtered = items;

  if (status) {
    filtered = filtered.filter(item => computeStatus(item.quantity) === status);
  }

  if (category) {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  return filtered;
}

module.exports = {
  readAllItems,
  saveInventory,
  getNewId,
  getItemByID,
  computeStatus,
  filterItems
};