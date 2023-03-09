const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const {
  getPlaces,
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places");
const fileUpload = require("../middleware/file-upload");

router.get("/", getPlaces);
router.get(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  getPlaceById
);
router.get("/user/:uid", getPlacesByUserId);
router.post("/", fileUpload.single("image"), createPlace);
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);
router.delete("/:pid", deletePlace);

module.exports = router;
