const fs = require("fs");
const path = require("path");

const inventoryPath = path.join(__dirname, "..", "data", "inventory.json");


function readInventory() {
  try {
    const data = fs.readFileSync(inventoryPath, "utf8");
    return JSON.parse(data);
  } catch {
    return { items: [] };
  }
}


function saveInventory(data) {
  fs.writeFileSync(inventoryPath, JSON.stringify(data, null, 2));
}


function generateId(items) {
  if (!items.length) return 1;
  return items[items.length - 1].id + 1;
}


function serveStaticFile(filePath, contentType, res) {

  const stream = fs.createReadStream(filePath);

  stream.on("error", () => {
    res.writeHead(404);
    res.end("File Not Found");
  });

  res.writeHead(200, { "Content-Type": contentType });
  stream.pipe(res);
}



module.exports = {
  readInventory,
  saveInventory,
  generateId,
  serveStaticFile
};
