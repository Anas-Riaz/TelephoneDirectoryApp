const express = require("express");
const {
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/adminController.js");
const verifyToken = require("../middleware/authMiddleware.js");

const router = express.Router();

// protect all admin routes
router.get("/employees", searchEmployees);
router.post("/employees", verifyToken, addEmployee);
router.put("/employees/:empNo", verifyToken, updateEmployee);
router.delete("/employees/:empNo", verifyToken, deleteEmployee);

module.exports = router;
