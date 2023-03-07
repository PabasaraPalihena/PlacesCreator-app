const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//listen for request
const PORT = 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
