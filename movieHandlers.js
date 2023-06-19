const database = require("./database");

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
      res.status(500).send("Error saving the movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
};
