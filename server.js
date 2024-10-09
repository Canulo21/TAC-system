const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
app.use("/profilepics/:id", express.static("public/profilepics"));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Admin registration API
app.post("/admin-registration", async (req, res) => {
  const { fname, mname, lname, role, username, password } = req.body;

  try {
    // Concatenate names for checking existence
    const fullName = `${fname} ${mname} ${lname}`.trim();

    // Check if an admin with the same full name already exists
    const checkQuery = `
      SELECT * FROM users 
      WHERE CONCAT_WS(' ', fname, mname, lname) = ?`;

    db.query(checkQuery, [fullName], async (err, results) => {
      if (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          error: "User already exists",
          details: "An admin with the same name already exists.",
        });
      }

      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // MySQL query to insert the new admin data into the 'user' table with 'status' set to 'pending'
      const sql =
        "INSERT INTO users (fname, mname, lname, role, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        fname,
        mname,
        lname,
        role,
        username,
        hashedPassword,
        "pending",
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.status(200).json({
          message: "Admin registered successfully with pending status",
        });
      });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// for login form
// for login form
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check for empty fields before querying the database
  if (!username || !password) {
    return res.status(400).json({
      error: "Bad Request",
      details: "Username and password must not be empty!",
    });
  }

  // Query the database to find the user by username
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], async (err, data) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if the user exists
    if (data.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = data[0]; // Assuming 'user' is the table name

    // Check if the user's status is pending
    if (user.status === "pending") {
      return res.status(403).json({ error: "Account is pending approval" });
    }

    try {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // If password matches, login is successful
      return res.status(200).json({ message: "Login successful", user });
    } catch (bcryptError) {
      console.error("Error comparing passwords:", bcryptError);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

// GET pending admins
app.get("/pending-admins", (req, res) => {
  const query = "SELECT * FROM users WHERE status = 'pending'";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching pending admins:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// POST accept admin
app.post("/accept-admin", (req, res) => {
  const { userId } = req.body;
  const query = "UPDATE users SET status = 'accepted' WHERE user_id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error accepting admin:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ message: "Admin accepted successfully" });
  });
});

// DELETE admin
app.delete("/delete-admin/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "DELETE FROM users WHERE user_id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting admin:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  });
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
app.post("/addMember", upload.single("file"), async (req, res) => {
  try {
    const {
      fname,
      mname,
      lname,
      gender,
      birthdate,
      category,
      baptized,
      position,
    } = req.body;
    const profile_pic_url = req.file ? req.file.filename : null; // Check if a file was uploaded

    if (
      !fname ||
      !lname ||
      !gender ||
      !birthdate ||
      !category ||
      !baptized ||
      !position ||
      !profile_pic_url
    ) {
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
              "INSERT INTO users (fname, mname, lname, gender, birthdate, category, baptized, position, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            db.query(
              insertQuery,
              [
                fname,
                mname,
                lname,
                gender,
                birthdate,
                category,
                baptized,
                position,
                profile_pic_url,
              ],
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
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
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

  const {
    fname,
    mname,
    lname,
    birthdate,
    gender,
    position,
    category,
    baptized,
  } = data;
  const query =
    "UPDATE users SET `fname`=?, `mname`=?, `lname`=?, `birthdate`=?, `gender`=?, `position`=?, `category`=?, `baptized`=? WHERE user_id = ?";

  db.query(
    query,
    [
      fname,
      mname,
      lname,
      birthdate,
      gender,
      position,
      category,
      baptized,
      userId,
    ],
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

// for edit upload image
app.put("/uploadProfile/:id", upload.single("file"), (req, uploadRes) => {
  const userId = req.params.id;
  const image = req.file.filename;
  const query = "UPDATE users SET profile_pic_url = ? WHERE user_id = ?";

  db.query(query, [image, userId], (err, result) => {
    if (err) {
      console.error(err);
      return uploadRes.status(500).json({ Message: "Error" });
    }

    if (result.affectedRows === 0) {
      return uploadRes.status(404).json({ Message: "User not found" });
    }

    return uploadRes.json({ status: "Success" });
  });
});

// Check if cash on hand is already set
app.get("/check-cash-on-hand", (req, res) => {
  const query = "SELECT set_coh FROM coh LIMIT 1"; // Assume you only want one record

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error checking cash on hand:", err);
      return res.status(500).json({ error: "Server error" });
    }
    if (result.length > 0) {
      res.status(200).json({ setCoh: result[0].set_coh });
    } else {
      res.status(200).json({ setCoh: null });
    }
  });
});

// Set cash on hand only if not already set
app.post("/set-cash-on-hand", (req, res) => {
  const { coh } = req.body;

  // Check if cash on hand is already set
  const checkQuery = "SELECT set_coh FROM coh LIMIT 1";

  db.query(checkQuery, (err, result) => {
    if (err) {
      console.error("Error checking cash on hand:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length > 0) {
      // Cash on hand already set
      return res.status(400).json({ error: "Cash on hand is already set" });
    } else {
      // Insert new cash on hand value
      const query = "INSERT INTO coh (set_coh) VALUES (?)";
      db.query(query, [coh], (err, result) => {
        if (err) {
          console.error("Error inserting cash on hand:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.status(200).json({ message: "Cash on hand set successfully" });
      });
    }
  });
});

// for financial post income
app.get("/getFinancial", (req, res) => {
  const query = "SELECT * from financial_up_money ORDER BY id DESC";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});
app.post("/upMoney", (req, res) => {
  const { up_money, date } = req.body;
  const query = "INSERT INTO financial_up_money (up_money, date) VALUES (?, ?)";

  if (!up_money) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  db.query(query, [up_money, date], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ Message: "Error" });
    }
    return res.status(200).json({ Status: "Success" });
  });
});

app.get("/getTotalIncome", (req, res) => {
  // const query = "SELECT SUM(up_money) AS totalIncome FROM financial_up_money";
  const query = "SELECT SUM(up_money) As totalIncome From financial_up_money";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }

    return res.json(data);
  });
});

// by year
app.get("/getTotalIncomeByYear", (req, res) => {
  const year = req.query.year;
  const query = `
    SELECT MONTH(DATE) AS MONTH, SUM(up_money) AS totalIncome 
    FROM financial_up_money 
    WHERE YEAR(DATE) = ?
    GROUP BY MONTH
  `;
  db.query(query, [year], (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// for expesnes
app.get("/expenses", (req, res) => {
  const query = "SELECT * from financial_expenses ORDER BY id DESC ";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});
app.get("/getTotalExpenses", (req, res) => {
  const query = "SELECT SUM(amount) As totalExpenses From financial_expenses";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }

    return res.json(data);
  });
});

// by year
app.get("/getTotalExpensesByYear", (req, res) => {
  const year = req.query.year;
  const query = `
    SELECT MONTH(DATE) AS MONTH, SUM(amount) AS totalExpenses 
    FROM financial_expenses 
    WHERE YEAR(DATE) = ?
    GROUP BY MONTH
  `;
  db.query(query, [year], (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// view a expense data
app.get("/viewExpenses/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM financial_expenses WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Expenses not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});
app.post("/exMoney", (req, res) => {
  const { amount, used_for, date } = req.body;

  if (!amount || !used_for) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "INSERT INTO financial_expenses (amount, used_for, date) VALUES (?, ?, ?)";

  db.query(query, [amount, used_for, date], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ Message: "Error" });
    }
    return res.status(200).json({ Status: "Success" });
  });
});

app.delete("/deleteFinancial/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM financial_expenses WHERE id = ?";
  db.query(query, [id], (err, result) => {
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

// for update financial expsenses
app.put("/updateFinancial/:id", (req, res) => {
  const id = req.params.id;
  const { data } = req.body; // Destructure 'data' from req.body
  const { amount, used_for } = data;

  if (!amount || !used_for) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query = "UPDATE financial_expenses SET amount=?, used_for=? WHERE id=?";

  db.query(query, [amount, used_for, id], (queryError, result) => {
    if (queryError) {
      console.error("updateError", queryError);
      return res.status(500).json({
        error: "Failed to update expenses.",
        details: queryError.message,
      });
    }
    if (!result.affectedRows) {
      return res.status(404).json({
        error: "Expenses not found.",
      });
    }
    return res.json({ updated: true });
  });
});

// Add a new fund
app.post("/add-fund", (req, res) => {
  const { fund_title } = req.body;
  const sql = "INSERT INTO funds (fund_title) VALUES (?)";
  db.query(sql, [fund_title], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Update an existing fund
app.put("/update-fund/:id", (req, res) => {
  const { id } = req.params;
  const { fund_title } = req.body;
  const sql = "UPDATE funds SET fund_title = ? WHERE id = ?";
  db.query(sql, [fund_title, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete a fund
app.delete("/delete-fund/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM funds WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put("/update-fund-amount/:id", async (req, res) => {
  const { id } = req.params;
  const { fund_amount } = req.body;

  try {
    // Update the fund amount by adding the new amount to the existing amount
    await db.query(
      "UPDATE funds SET fund_amount = fund_amount + ? WHERE id = ?",
      [fund_amount, id]
    );
    res.status(200).send("Fund amount updated successfully");
  } catch (error) {
    console.error("Error updating fund amount:", error);
    res.status(500).send("Error updating fund amount");
  }
});

app.get("/get-funds", (req, res) => {
  const query = "SELECT * from funds ORDER BY id DESC";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

// for events
app.get("/getEvents", (req, res) => {
  const query = "SELECT * from events ORDER BY id DESC";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});
app.get("/getEventsBoard", (req, res) => {
  const query = "SELECT * FROM EVENTS WHERE STATUS = 'Post' ORDER BY id DESC";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});
app.post("/addEvent", (req, res) => {
  const { title, location, date, status, description } = req.body;

  if (!title || !location || !date || !status) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "INSERT INTO events (title, location, status, date, description) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [title, location, status, date, description],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ Message: "Error" });
      }
      return res.status(200).json({ Status: "Success" });
    }
  );
});
app.delete("/deleteEvent/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM events WHERE id = ?";
  db.query(query, [id], (err, result) => {
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

app.get("/viewEvent/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM events WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Event not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});
app.put("/updateEvent/:id", (req, res) => {
  const id = req.params.id;
  const { data } = req.body; // Destructure 'data' from req.body
  const { title, location, date, status } = data;

  if (!title || !location || !date || !status) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "UPDATE events SET title=?, location=?, date=?, status=? WHERE id=?";

  db.query(query, [title, location, date, status, id], (queryError, result) => {
    if (queryError) {
      console.error("updateError", queryError);
      return res.status(500).json({
        error: "Failed to update event.",
        details: queryError.message,
      });
    }
    if (!result.affectedRows) {
      return res.status(404).json({
        error: "Event not found.",
      });
    }
    return res.json({ updated: true });
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// for getting baptized
app.get("/getIsBaptized", (req, res) => {
  const query = "SELECT * FROM users WHERE baptized = 'Yes' Or baptized = 'No'";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }

    return res.json(data);
  });
});

// for getting birthday
app.get("/getIsBirthday", (req, res) => {
  const query =
    "SELECT CONCAT(fname, ' ', COALESCE(mname, ''), ' ', lname) AS fullname, birthdate FROM users WHERE(MONTH(birthdate) = MONTH(CURDATE()) AND DAY(birthdate) BETWEEN DAY(CURDATE() - INTERVAL 7 DAY) AND DAY(CURDATE()))";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }

    return res.json(data);
  });
});
