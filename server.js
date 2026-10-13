const http = require("http");
const fs = require("fs");
const path = require("path");

const file = fs.readFileSync(
  path.join(__dirname, "public", "google55ff53bcc23f6fe8.html"),
  "utf-8"
);
const port = process.env.PORT || 3000;

http
  .createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(file);
  })
  .listen(port, () => {
    console.log(`Serving google verification file at http://localhost:${port}`);
  });
