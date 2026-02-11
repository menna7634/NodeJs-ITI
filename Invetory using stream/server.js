const http = require("http");
const path = require("path");

const {
  readInventory,
  saveInventory,
  generateId,
  serveStaticFile
} = require("./helpers/inventoryHelper");


const server = http.createServer((req, res) => {

  if (req.url === "/css/style.css") {
    return serveStaticFile(
      path.join(__dirname, "public/css/style.css"),
      "text/css",
      res
    );
  }

  if (req.url.startsWith("/images/")) {
    return serveStaticFile(
      path.join(__dirname, "public", req.url),
      "image/jpg",
      res
    );
  }


  if (req.url === "/" && req.method === "GET") {
    return serveStaticFile(
      path.join(__dirname, "pages/home.html"),
      "text/html",
      res
    );
  }


  if (req.url === "/inventory" && req.method === "GET") {
    return serveStaticFile(
      path.join(__dirname, "data/inventory.json"),
      "application/json",
      res
    );
  }


  if (req.url === "/inventory" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {

      try {

        const parsed = JSON.parse(body);

        if (!parsed.itemName || parsed.itemName.trim() === "") {
          res.writeHead(400);
          return res.end("Item name is required");
        }

        if (parsed.quantity !== undefined && parsed.quantity < 0) {
          res.writeHead(400);
          return res.end("Quantity must be positive");
        }

        const data = readInventory();

        const newItem = {
          id: generateId(data.items),
          itemName: parsed.itemName.trim(),
          quantity: parsed.quantity || 1,
          category: parsed.category || "General"
        };

        data.items.push(newItem);
        saveInventory(data);

        res.writeHead(201);
        res.end("Item Added");

      } catch {
        res.writeHead(400);
        res.end("Invalid JSON");
      }

    });

    return;
  }


  if (req.url === "/astronomy") {
    return serveStaticFile(
      path.join(__dirname, "pages/astronomy.html"),
      "text/html",
      res
    );
  }


  if (req.url === "/serbal") {
    return serveStaticFile(
      path.join(__dirname, "pages/serbal.html"),
      "text/html",
      res
    );
  }


 if (req.url === "/astronomy/download") {

  const filePath = path.join(__dirname, "public/images/astronomy.jpg");

  res.writeHead(200, {
    "Content-Disposition": "attachment; filename=astronomy.jpg",
    "Content-Type": "image/jpg"
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on("error", () => {
    res.writeHead(404);
    res.end("File not found");
  });

  return; 
}



  serveStaticFile(
    path.join(__dirname, "pages/404.html"),
    "text/html",
    res
  );

});


server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
