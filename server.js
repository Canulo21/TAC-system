const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "react_tc",
});

// get all members
app.get("/users", (req, res) => {
  const order = req.query.order || "asc";
  const sql = `SELECT * FROM users ORDER BY user_id ${order.toUpperCase()}`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// get category
app.get("/categorized", (req, res) => {
  const query = "SELECT category From users";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/gender", (req, res) => {
  const query = "SELECT gender From users";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Registration of members
app.post("/addMember", (req, res) => {
  const { data } = req.body; // Destructure 'data' from req.body

  const { fname, mname, lname, gender, birthdate, category, position } = data;

  const query =
    "INSERT INTO users (fname, mname, lname, gender, birthdate, category, position) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [fname, mname, lname, gender, birthdate, category, position],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      } else {
        console.log("Data inserted successfully");

        // After successful insertion, retrieve the last inserted ID
        const lastInsertedId = result.insertId;

        // Query to retrieve the inserted data in descending order based on user_id
        const selectQuery =
          "SELECT * FROM users WHERE user_id = ? ORDER BY user_id DESC LIMIT 1";
        db.query(selectQuery, [lastInsertedId], (selectErr, selectResult) => {
          if (selectErr) {
            console.error("Error retrieving data:", selectErr);
            res.status(500).json({
              error: "Internal Server Error",
              details: selectErr.message,
            });
          } else {
            const insertedData = selectResult[0];
            res.status(200).json({
              message: "Data inserted successfully",
              data: insertedData,
            });
          }
        });
      }
    }
  );
});

// Remove a Member
app.delete("/deleteMember/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM users WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.status(200).json({ message: "Data deleted successfully" });
    }
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});