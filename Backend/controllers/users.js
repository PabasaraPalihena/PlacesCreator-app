const { v4: uuid } = require("uuid");
const validationResults = require("express-validator");
const HttpError = require("../models/httpError");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

exports.getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

exports.signup = async (req, res, next) => {
  const error = validationResults(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Invalid input passed", 422));
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const err = new HttpError("Signup failed", 500);
    return next(err);
  }

  if (existingUser) {
    const err = new HttpError("User already exisit, Please Login", 422);
    return next(err);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://image.shutterstock.com/image-photo/young-handsome-man-beard-wearing-260nw-1768126784.jpg",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (e) {
    const err = new HttpError("Signup failed", 500);
    return next(err);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      401
    );
  }

  res.json({ message: "Logged in!" });
};
