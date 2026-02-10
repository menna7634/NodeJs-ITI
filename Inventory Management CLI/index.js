const {
  readAllItems,
  saveInventory,
  getNewId,
  getItemByID,
  computeQuntity
} = require("./helper");

// 1 
function addNewItem (itemName)
{
const items=readAllItems();    
const newid=getNewId(items);
const newItem={
    id:newid,
    itemName:itemName,
    quantity:1,
    category:"General"
};
  items.push(newItem);
  saveInventory({ items }) 
  
  console.log(` Added item: ${itemName}`);
  console.log(` ID: ${newid}, Name: ${itemName} ,  Quantity: 1`);
  }



//2
function destock(id, quantity) {
  const result = getItemByID(id);
  if (!result) {
    return;
  }

  const { item, items } = result;

  if (quantity <= 0) {
    console.log("Quantity must be greater than zero");
    return;
  }

  if (quantity > item.quantity) {
    console.log("Can't Destock as quantity is greater than stock");
    return;
  }

  item.quantity -= quantity;
  saveInventory({ items });
  console.log(`Quantity Updated. New Quantity: ${item.quantity}`);
}


//3
function restock(id,quantity)
{
   const result = getItemByID(id);
  if (!result) {
    return;
  }
    const { item, items } = result;

  if (quantity<=0) {
  console.log("Quantity must be greater than zero");
  return;
}

  item.quantity+=quantity;
   saveInventory({ items });
  console.log(` Quantity Updated . The new Quantity ${item.quantity}`);

}
//4
function editName(id,newName)
{
  if (!newName||newName.trim()==="") {
  console.log("Invalid name");
  return;
}
    const result = getItemByID(id);
  if (!result) {
    return;
  }
    const { item, items } = result;
  item.itemName=newName;
   saveInventory({ items });
  console.log(`ItemName Updated . New ItemName ${item.itemName}`);
}
 //5
function removeItem(id) {
  const result = getItemByID(id);

  if (!result) return;

  const { item, items } = result;
  const index = items.findIndex(i => i.id === item.id);
  items.splice(index, 1);
  saveInventory({ items });
  console.log(`Item ${item.itemName} removed successfully`);
}



 // 6
function listItems() {
  const items = readAllItems();

  if (items.length === 0) {
    console.log("No items in inventory");
    return;
  }

  const tableData = items.map(item => ({
    ID: item.id,
    Name: item.itemName,
    Quantity: item.quantity,
    Status: computeQuntity(item.quantity)
  }));

  console.table(tableData);
}

// 7

function summary() {
  const items = readAllItems();

  if (!items.length) {
    console.log("Inventory is empty");
    return;
  }

  let totalQuantity = 0;
  let available = 0;
  let lowStock = 0;
  let outOfStock = 0;

  items.map(item => {
    totalQuantity += item.quantity;
    const status = computeQuntity(item.quantity);
    if (status === "available"){
       available++;
    }else if (status === "low stock"){
       lowStock++;
    }else{
    outOfStock++;
    }
  });

  console.log("\n===== Inventory Summary =====\n");
  console.log("Total Items:", items.length);
  console.log("Total Quantity:", totalQuantity);
  console.log("Available:", available);
  console.log("Low Stock:", lowStock);
  console.log("Out Of Stock:", outOfStock);
}



const command = process.argv[2];

if (command === "add") {
  const itemName = process.argv[3];
  addNewItem(itemName);
}

else if (command === "destock") {
  const id =Number(process.argv[3]);
  const quantity =Number(process.argv[4]);
  destock(id, quantity);
}

else if (command === "restock") {
  const id =Number(process.argv[3]);
  const quantity = process.argv[4];
  restock(id, quantity);
}

else if (command === "edit") {
  const id = Number(process.argv[3]);
  const newName = process.argv[4];
  editName(id, newName);
}

else if (command === "remove") {
  const id = Number(process.argv[3]);
  removeItem(id);
}

else if (command === "list") {
  listItems();
}

else if (command === "summary") {
  summary();
}

else {
  console.log("Unknown command");
}



