const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places");

const app = express();

//Mount routes
app.use("/api/places", placeRoutes);

//Error handling
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
