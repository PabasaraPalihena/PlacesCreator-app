const express = require("express");
const router = express.Router();

const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places");

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlaceByUserId);
router.post("/", createPlace);
router.patch("/:pid", updatePlace);
router.delete("/:pid", deletePlace);

module.exports = router;
