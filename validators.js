const { body, validationResult } = require("express-validator");

const validateUser = [
  body("firstname").isLength({ max: 255 }),
  body("lastname").isLength({ max: 255 }),
  body("email").isEmail(),
  body("city").isLength({ max: 255 }),
  body("language").isLength({ max: 255 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

const validateMovie = [
  body("title").isLength({ max: 255 }),
  body("director").isLength({ max: 255 }),
  body("year").isInt(),
  body("color").isBoolean(),
  body("duration").isInt(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = {
  validateUser,
  validateMovie,
};
