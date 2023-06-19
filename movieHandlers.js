const database = require("./database");
const { validationResult } = require("express-validator");

const getMovies = (req, res) => {
  database
    .query("SELECT * FROM movies")
    .then(([movies]) => res.json(movies))
    .catch((error) => res.json(error));
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([movies]) => {
      if (movies.length > 0) {
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((error) => res.json(error));
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ validationErrors: errors.array() });
  }

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      console.log(result);
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((error) => {
      console.error(error);
      res.status(422).send("Error saving the movie");
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ validationErrors: errors.array() });
  }

  database
    .query(
      "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).send("Not Found");
      }
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(422).send("Error updating the movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
};
