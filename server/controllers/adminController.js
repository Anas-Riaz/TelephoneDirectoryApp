const sql = require("mssql");
const getPool = require("../db.js");

const searchEmployees = async (req, res) => {
  const {
    EmpNo,
    Name,
    DepartmentID,
    LocationID,
    DesignationID,
    IPNumbers,
    Source,
  } = req.query;

  try {
    const pool = await getPool();

    let query = `
      SELECT e.EmpNo, e.Name, d.DepartmentName, des.DesignationName, 
             l.LocationName, 
             STRING_AGG(CAST(ip.ExtID AS VARCHAR), ',') AS ExtIDs, -- Aggregate ExtIDs
             STRING_AGG(ie.IPNumber, ',') AS IPNumbers, -- Aggregate IPNumbers
             e.Email
      FROM Employee e
      LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN Locations l ON e.LocationID = l.LocationID
      LEFT JOIN Designations des ON e.DesignationID = des.DesignationID
      LEFT JOIN EmployeeIP ip ON e.EmpNo = ip.EmpNo
      LEFT JOIN IPExtension ie ON ip.ExtID = ie.ExtID
      WHERE 1=1
    `;

    const request = pool.request();

    if (EmpNo) {
      query += ` AND e.EmpNo = @empNo`;
      request.input("empNo", sql.Int, EmpNo);
    }
    if (Name) {
      query += ` AND e.Name LIKE @name`;
      request.input("name", sql.VarChar, `%${Name}%`);
    }
    if (DesignationID) {
      query += ` AND e.DesignationID = @designation`;
      request.input("designation", sql.Int, parseInt(DesignationID));
    }
    if (DepartmentID) {
      query += ` AND d.DepartmentID = @department`;
      request.input("department", sql.Int, parseInt(DepartmentID));
    }
    if (LocationID) {
      query += ` AND l.LocationID = @location`;
      request.input("location", sql.Int, parseInt(LocationID));
    }
    if (IPNumbers) {
      query += ` AND ie.IPNumber LIKE @ipExtension`;
      request.input("ipExtension", sql.VarChar, `%${IPNumbers}%`);
    }
    if (Source) {
      query += ` AND e.Source LIKE @source`;
      request.input("source", sql.VarChar, `%${Source}%`);
    }

    query += `
      GROUP BY e.EmpNo, e.Name, d.DepartmentName, des.DesignationName, 
               l.LocationName, e.Email
    `;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Search error:", err); // Log the error for debugging
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

const addEmployee = async (req, res) => {
  const {
    EmpNo,
    Name,
    DesignationID,
    Source,
    Email,
    DepartmentID,
    LocationID,
    IPNumbers, // array of IPs
  } = req.body;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("EmpNo", sql.VarChar, EmpNo)
      .input("Name", sql.VarChar, Name)
      .input("DepartmentID", sql.Int, DepartmentID)
      .input("DesignationID", sql.Int, DesignationID)
      .input("LocationID", sql.Int, LocationID)
      .input("Source", sql.VarChar, Source)
      .input("Email", sql.VarChar, Email).query(`
        INSERT INTO Employee (EmpNo, Name, DepartmentID, DesignationID, LocationID, Source, Email)
        VALUES (@EmpNo, @Name, @DepartmentID, @DesignationID, @LocationID, @Source, @Email)
      `);

    for (let ip of IPNumbers) {
      const ipResult = await pool.request().input("IPNumber", sql.VarChar, ip)
        .query(`
          INSERT INTO IPExtension (IPNumber)
          OUTPUT INSERTED.ExtID
          VALUES (@IPNumber)
        `);
      const ExtID = ipResult.recordset[0].ExtID;
      await pool
        .request()
        .input("EmpNo", sql.VarChar, EmpNo)
        .input("ExtID", sql.Int, ExtID)
        .query(`INSERT INTO EmployeeIP (EmpNo, ExtID) VALUES (@EmpNo, @ExtID)`);
    }

    res.json({ message: "Employee added successfully" });
  } catch (err) {
    console.error("SQL Error:", err);
    const errorNumber = err.number || err.originalError?.info?.number;
    if (errorNumber === 2627) {
      return res
        .status(409)
        .json({ message: "Employee with this EmpNo already exists." });
    }

    if (errorNumber === 547) {
      return res.status(400).json({
        message:
          "Invalid DepartmentID, DesignationID, or LocationID (foreign key violation).",
      });
    }

    if (errorNumber === 515) {
      return res
        .status(400)
        .json({ message: "One or more required fields are missing." });
    }

    res
      .status(500)
      .json({ message: "Failed to add employee", error: err.message });
  }
};

// UPDATE
const updateEmployee = async (req, res) => {
  const empNo = req.params.empNo;
  const {
    Name,
    DesignationID,
    Source,
    Email,
    DepartmentID,
    LocationID,
    IPNumbers, // optional array
  } = req.body;

  try {
    const updates = [];
    const pool = await getPool();
    const request = pool.request().input("EmpNo", sql.VarChar, empNo);

    if (Name !== undefined) {
      updates.push("Name=@Name");
      request.input("Name", sql.VarChar, Name);
    }

    if (DepartmentID !== undefined && DepartmentID !== null) {
      updates.push("DepartmentID=@DepartmentID");
      request.input("DepartmentID", sql.Int, DepartmentID);
    }

    if (DesignationID !== undefined && DesignationID !== null) {
      updates.push("DesignationID=@DesignationID");
      request.input("DesignationID", sql.Int, DesignationID);
    }

    if (LocationID !== undefined && LocationID !== null) {
      updates.push("LocationID=@LocationID");
      request.input("LocationID", sql.Int, LocationID);
    }

    if (Source !== undefined) {
      updates.push("Source=@Source");
      request.input("Source", sql.VarChar, Source);
    }

    if (Email !== undefined) {
      updates.push("Email=@Email");
      request.input("Email", sql.VarChar, Email);
    }

    if (updates.length > 0) {
      await request.query(`
        UPDATE Employee
        SET ${updates.join(", ")}
        WHERE EmpNo=@EmpNo
      `);
    }

    if (IPNumbers !== undefined) {
      await pool
        .request()
        .input("EmpNo", sql.VarChar, empNo)
        .query(`DELETE FROM EmployeeIP WHERE EmpNo=@EmpNo`);

      for (let ip of IPNumbers) {
        let existingIpResult = await pool
          .request()
          .input("IPNumber", sql.Char, ip)
          .query(`SELECT ExtID FROM IPExtension WHERE IPNumber=@IPNumber`);

        let ExtID;
        if (existingIpResult.recordset.length > 0) {
          ExtID = existingIpResult.recordset[0].ExtID;
        } else {
          const ipResult = await pool
            .request()
            .input("IPNumber", sql.Char, ip)
            .query(
              `INSERT INTO IPExtension (IPNumber) OUTPUT INSERTED.ExtID VALUES (@IPNumber)`
            );
          ExtID = ipResult.recordset[0].ExtID;
        }

        await pool
          .request()
          .input("EmpNo", sql.VarChar, empNo)
          .input("ExtID", sql.Int, ExtID)
          .query(
            `INSERT INTO EmployeeIP (EmpNo, ExtID) VALUES (@EmpNo, @ExtID)`
          );
      }
    }

    const employeeResult = await pool
      .request()
      .input("EmpNo", sql.VarChar, empNo).query(`
        SELECT 
          E.EmpNo, E.Name, E.Email, E.Source,
          D.DepartmentID, D.DepartmentName,
          Desig.DesignationID, Desig.DesignationName,
          L.LocationID, L.LocationName,
          STUFF((SELECT ',' + I.IPNumber
                 FROM EmployeeIP EI
                 INNER JOIN IPExtension I ON EI.ExtID = I.ExtID
                 WHERE EI.EmpNo = E.EmpNo
                 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS IPNumbersCSV,
          STUFF((SELECT ',' + CAST(EI.ExtID AS NVARCHAR)
                 FROM EmployeeIP EI
                 WHERE EI.EmpNo = E.EmpNo
                 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS ExtIDsCSV
        FROM Employee E
        LEFT JOIN Departments D ON E.DepartmentID = D.DepartmentID
        LEFT JOIN Designations Desig ON E.DesignationID = Desig.DesignationID
        LEFT JOIN Locations L ON E.LocationID = L.LocationID
        WHERE E.EmpNo = @EmpNo
      `);

    if (!employeeResult.recordset.length) {
      return res
        .status(404)
        .json({ message: "Employee not found after update" });
    }

    const emp = employeeResult.recordset[0];
    emp.IPNumbers = emp.IPNumbersCSV ? emp.IPNumbersCSV.split(",") : [];
    emp.ExtIDs = emp.ExtIDsCSV ? emp.ExtIDsCSV.split(",") : [];
    delete emp.IPNumbersCSV;
    delete emp.ExtIDsCSV;

    res.json(emp);
  } catch (err) {
    console.error("Update error:", err.message, err.stack);
    res
      .status(500)
      .json({ message: "Failed to update employee", error: err.message });
  }
};

// DELETE
const deleteEmployee = async (req, res) => {
  const empNo = req.params.empNo;

  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // 1. Delete from EmployeeIP
      await transaction
        .request()
        .input("EmpNo", sql.VarChar, empNo)
        .query(`DELETE FROM EmployeeIP WHERE EmpNo=@EmpNo`);

      // 2. Delete from Employee
      const result = await transaction
        .request()
        .input("EmpNo", sql.VarChar, empNo)
        .query(`DELETE FROM Employee WHERE EmpNo=@EmpNo`);

      if (result.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: "Employee not found" });
      }

      // ✅ Skip cleanup of IPExtension
      await transaction.commit();
      res.json({ message: "Employee deleted successfully" });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete employee" });
  }
};

module.exports = {
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
