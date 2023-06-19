const database = require("./database");
const { validationResult } = require("express-validator");

const getUsers = (req, res) => {
  const { language, city } = req.query;

  let sql = "SELECT * FROM users";
  const sqlValues = [];

  if (language) {
    sql += " WHERE language = ?";
    sqlValues.push(language);

    if (city) {
      sql += " AND city = ?";
      sqlValues.push(city);
    }
  } else if (city) {
    sql += " WHERE city = ?";
    sqlValues.push(city);
  }

  database
    .query(sql, sqlValues)
    .then(([users]) => res.json(users))
    .catch((error) => res.json(error));
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([users]) => {
      if (users.length > 0) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((error) => res.json(error));
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((error) => {
      console.error(error);
      res.status(422).send("Error saving the user");
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(422).send("Error editing the user");
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
};
