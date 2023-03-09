const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/httpError");
const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Invalid input passed", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const err = new HttpError("Signup failed.......", 500);
    return next(err);
  }

  if (existingUser) {
    const err = new HttpError("User already exisit, Please Login", 422);
    return next(err);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    password,
    places: [],
  });

  try {
    await User.create(createdUser);
  } catch (e) {
    const err = new HttpError("Signup failed", 500);
    return next(err);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// exports.createUser = async (req, res, next) => {
//   const { name, email, password, places } = req.body;

//   const createdUser = new User({
//     name,
//     email,
//     image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
//     password,
//     places,
//   });

//   try {
//     const place = await User.create(createdUser);
//     res.status(201).json({
//       success: true,
//       data: place,
//     });
//   } catch (e) {
//     console.log(e);
//     const error = new HttpError("Failed creating place.try again", 500);
//     return next(error);
//   }
// };

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};
