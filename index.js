const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./lib/connectDb");
const apiRoutes = require("./routes/index");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Middleware for logging HTTP requests
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDb();
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
