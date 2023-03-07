const express = require("express");
const router = express.Router();

const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
} = require("../controllers/places");

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlaceByUserId);
router.post("/", createPlace);

module.exports = router;
