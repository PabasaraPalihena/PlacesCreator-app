const uuid = require("uuid");
const { validationResults } = require("express-validator");
const HttpError = require("../models/httpError");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, can't find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const e = new HttpError(
      "Could not find a places for the provided id.",
      404
    );
    return next(e);
  }

  res.json({ place });
};

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places) {
    throw new HttpError(
      "Could not find a place for the provided user id.",
      404
    );
  }

  res.json({ places });
};

// exports.createPlace = async (req, res, next) => {
//   const error = validationResults(req);

//   if (!error.isEmpty()) {
//     throw new HttpError("Invalid input passed", 422);
//   }
//   const { title, description, coordinates, address, creator } = req.body;

//   const createdPlace = new place({
//     title,
//     description,
//     location: coordinates,
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
//     address,
//     creator,
//   });

//   try {
//     await createdPlace.save();
//   } catch (err) {
//     const error = new HttpError("Failed creating place.try again", 500);
//     return next(error);
//   }

//   res.status(201).json({ place: createdPlace });
// };

exports.createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    address,
    creator,
  });

  try {
    const place = await Place.create(createdPlace);
    res.status(201).json({
      success: true,
      data: place,
    });
  } catch (e) {
    console.log(e);
    const error = new HttpError("Failed creating place.try again", 500);
    return next(error);
  }
};

exports.updatePlace = (req, res, next) => {
  const error = validationResults(req);

  if (!error.isEmpty()) {
    throw new HttpError("Invalid input passed", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that Id", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};
