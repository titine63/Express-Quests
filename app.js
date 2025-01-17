require("dotenv").config();

const express = require("express");
const { body, validationResult } = require("express-validator");

const { validateMovie, validateUser } = require("./validators.js");

const app = express();

app.use(express.json());

// Définir le port en utilisant la variable d'environnement APP_PORT ou une valeur par défaut
const port = process.env.APP_PORT ?? 5001;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", validateUser, userHandlers.postUser);
app.put("/api/users/:id", validateUser, userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
