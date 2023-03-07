const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places");
const userRoutes = require("./routes/users");
const HttpError = require("./models/httpError");

const app = express();

app.use(bodyParser.json());

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
