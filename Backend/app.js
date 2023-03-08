const express = require("express");
const bodyParser = require("body-parser");
require("./common/database")();
require("dotenv").config();

const placeRoutes = require("./routes/places");
const userRoutes = require("./routes/users");
const HttpError = require("./models/httpError");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

//Mount routes
app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

//Error handling
app.use((req, res, next) => {
  const error = new HttpError(
    "Could not find a place for the provided user id.",
    404
  );
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//listen for request
const PORT = 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
