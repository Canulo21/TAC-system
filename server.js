const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

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

// get gender
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

  if (!fname || !lname || !gender || !birthdate || !category || !position) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  // Check if the full name is already registered
  const fullnameQuery =
    "SELECT * FROM users WHERE CONCAT(fname, ' ', mname, ' ', lname) = ?";

  db.query(
    fullnameQuery,
    [`${fname} ${mname} ${lname}`],
    (fullnameErr, existingUsers) => {
      if (fullnameErr) {
        console.error("Error checking existing data:", fullnameErr);
        res.status(500).json({
          error: "Internal Server Error",
          details: fullnameErr.message,
        });
      } else {
        if (existingUsers.length > 0) {
          // Full name is already registered
          console.log("Data is already registered!");
          res.status(409).json({ error: "Data already exists" });
        } else {
          // Proceed with the insertion logic
          const insertQuery =
            "INSERT INTO users (fname, mname, lname, gender, birthdate, category, position) VALUES (?, ?, ?, ?, ?, ?, ?)";

          db.query(
            insertQuery,
            [fname, mname, lname, gender, birthdate, category, position],
            (insertErr, result) => {
              if (insertErr) {
                console.error("Error inserting data:", insertErr);
                res.status(500).json({
                  error: "Internal Server Error",
                  details: insertErr.message,
                });
              } else {
                console.log("Data inserted successfully");

                // After successful insertion, retrieve the last inserted ID
                const lastInsertedId = result.insertId;

                // Query to retrieve the inserted data in descending order based on user_id
                const selectQuery =
                  "SELECT * FROM users WHERE user_id = ? ORDER BY user_id DESC LIMIT 1";
                db.query(
                  selectQuery,
                  [lastInsertedId],
                  (selectErr, selectResult) => {
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
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});
// view a member data
app.get("/viewMember/:id", (req, res) => {
  const memberID = req.params.id;

  const query = `SELECT * FROM users WHERE user_id = ?`;

  db.query(query, [memberID], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Member not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});
// update member data
app.put("/updateMember/:id", (req, res) => {
  const userId = req.params.id;
  const { data } = req.body; // Destructure 'data' from req.body

  const { fname, mname, lname, birthdate, gender, position, category } = data;
  const query =
    "UPDATE users SET `fname`=?, `mname`=?, `lname`=?, `birthdate`=?, `gender`=?, `position`=?, `category`=? WHERE user_id = ?";

  db.query(
    query,
    [fname, mname, lname, birthdate, gender, position, category, userId],
    (queryError, result) => {
      if (queryError) {
        console.error("updateError", queryError);
        return res.status(500).json({
          error: "Failed to update user.",
          details: queryError.message,
        });
      }
      if (!result.affectedRows) {
        return res.status(404).json({
          error: "User not found.",
        });
      }
      return res.json({ updated: true });
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profilepics");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// for upload image
app.post("/uploadProfile", upload.single("image"), (req, uploadRes) => {
  console.log("here", req.file);
  const image = req.file.filename;
  const query = "UPDATE users SET profile_pic_url = ?";

  db.query(query, [image], (err, res) => {
    if (err) return res.json({ Message: "Error" });
    return uploadRes.json({ Status: "Success" });
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
