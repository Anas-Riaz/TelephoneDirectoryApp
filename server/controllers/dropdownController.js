const getPool = require("../db.js");
const sql = require("mssql");
// Departments
async function getDepartments(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(
        "SELECT DepartmentID AS id, DepartmentName AS name FROM Departments"
      );
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
}

async function addDepartments(req, res) {
  const { DepartmentName } = req.body;
  if (!DepartmentName)
    return res.status(400).json({ message: "DepartmentName is required." });
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("DepartmentName", sql.VarChar, DepartmentName).query(`
        INSERT INTO Departments (DepartmentName)
        SELECT @DepartmentName
        WHERE NOT EXISTS (
          SELECT 1 FROM Departments WHERE DepartmentName = @DepartmentName
        )
      `);
    if (result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ message: "Department Added Successfully." });
    } else {
      return res.status(400).json({ message: "Department Already Exists." });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

// Locations
async function getLocations(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT LocationID AS id, LocationName AS name FROM Locations");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
}

async function addLocations(req, res) {
  const { LocationName } = req.body;
  if (!LocationName)
    return res.status(400).json({ message: "Location is required." });
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("LocationName", sql.VarChar, LocationName).query(`
        INSERT INTO Locations (LocationName)
        SELECT @LocationName
        WHERE NOT EXISTS (
          SELECT 1 FROM Locations WHERE LocationName = @LocationName
        )
      `);
    if (result.rowsAffected[0] > 0) {
      return res.status(200).json({ message: "Location Added Successfully." });
    } else {
      return res.status(400).json({ message: "Location Already Exists." });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

// Designations
async function getDesignations(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(
        "SELECT DesignationID AS id, DesignationName AS name FROM Designations"
      );
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch designations" });
  }
}

async function addDesignations(req, res) {
  const { DesignationName } = req.body;
  if (!DesignationName)
    return res.status(400).json({ message: "Designation is required." });
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("DesignationName", sql.VarChar, DesignationName).query(`
        INSERT INTO Designations (DesignationName)
        SELECT @DesignationName
        WHERE NOT EXISTS (
          SELECT 1 FROM Designations WHERE DesignationName = @DesignationName
        )
      `);
    if (result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ message: "Designation Added Successfully." });
    } else {
      return res.status(400).json({ message: "Designation Already Exists." });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

module.exports = {
  getDepartments,
  getDesignations,
  getLocations,
  addDepartments,
  addLocations,
  addDesignations,
};
