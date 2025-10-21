const getPool = require("../db.js");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// ------------------- LOGIN -------------------
async function fetchingCredentials(req, res) {
  const { userName, password } = req.body;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("Username", sql.NVarChar, userName)
      .query(`
        SELECT * 
        FROM Admins 
        WHERE Username = @Username
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const admin = result.recordset[0];

    // ✅ compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, admin.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ✅ create token
    const token = jwt.sign(
      { id: admin.AdminID, username: admin.Username },
      JWT_SECRET,
      { expiresIn: "7d" } // valid for 1 hour
    );

    return res.json({ message: "Login Success", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

const registerAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const pool = await getPool();

    // Check if username already exists
    const existingResult = await pool.request()
      .input("Username", sql.NVarChar, userName)
      .query("SELECT * FROM Admins WHERE Username = @Username");

    if (existingResult.recordset.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.request()
      .input("Username", sql.NVarChar, userName)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .query("INSERT INTO Admins (Username, PasswordHash) VALUES (@Username, @PasswordHash)");

    // Generate token
    const token = jwt.sign(
      { userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { fetchingCredentials, registerAdmin };