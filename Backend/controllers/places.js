const uuid = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/httpError");
const Place = require("../models/place");
const User = require("../models/user");

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

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (e) {
    const error = new HttpError("Something went wrong, can't find places", 500);
    return next(error);
  }

  if (!places) {
    const e = new HttpError(
      "Could not find a place for the provided user id.",
      404
    );
    return next(e);
  }

  res.json({ places: places.map((place) => place.toObject({ getter: true })) });
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (e) {
    const err = new HttpError("Failed to create place", 500);
    return next(err);
  }

  if (!user) {
    const err = new HttpError("User not found", 404);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// exports.createPlace = async (req, res, next) => {
//   const { title, description, address, creator } = req.body;

//   const createdPlace = new Place({
//     title,
//     description,
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871516,
//     },
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
//     address,
//     creator,
//   });

//   let user;
//   try {
//     user = await User.findById(creator);
//   } catch (e) {
//     const err = new HttpError("Failed to create place", 500);
//     return next(err);
//   }

//   if (!user) {
//     const err = new HttpError("User not found", 404);
//     return next(err);
//   }

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await createdPlace.save({ session: sess });
//     // await Place.create(createdPlace,{session:sess});
//     user.places.push(createdPlace);
//     await user.save({ session: sess });
//     // await User.create(createdUser,{session:sess});
//     await sess.commitTransaction();

//     // const place = await Place.create(createdPlace);
//     // res.status(201).json({
//     //   success: true,
//     //   data: place,
//     // });
//   } catch (e) {
//     console.log(e);
//     const error = new HttpError("Failed creating place.try again", 500);
//     return next(error);
//   }
// };

// exports.updatePlace = async (req, res, next) => {
//   const error = validationResult(req);

//   if (!error.isEmpty()) {
//     throw new HttpError("Invalid input passed", 422);
//   }

//   const { title, description } = req.body;
//   const placeId = req.params.pid;

//   try {
//     const place = await Place.findByIdAndUpdate(placeId, title, description, {
//       new: true,
//       runValidators: true,
//     });

//     if (!place) {
//       return res.status(404).json({
//         success: false,
//         msg: "Could not find a Building with this ID",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: building,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       msg: "Server error",
//     });
//   }
// };

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not found place.",
      500
    );
    return next(error);
  }

  try {
    await place.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

// exports.deletePlace = async (req, res, next) => {
//   try {
//     const place = await Place.findByIdAndDelete(req.params.id);

//     if (!place) {
//       return res.status(404).json({
//         success: false,
//         msg: "Could not find a place with the given ID",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: place,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       msg: "Server error",
//     });
//   }
// };

exports.getPlaces = async (req, res) => {
  try {
    const place = await Place.find();
    return res.status(200).json({
      success: true,
      count: place.length,
      data: place,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
