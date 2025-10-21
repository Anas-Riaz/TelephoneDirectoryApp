const express = require("express");
const {
  getDepartments,
  getLocations,
  getDesignations,
  addDepartments,
  addLocations,
  addDesignations,
} = require("../controllers/dropdownController.js");
const verifyToken = require("../middleware/authMiddleware.js");

const router = express.Router();

// --------------- Fetching Data (could be public) ---------------
router.get("/departments", getDepartments);
router.get("/designations", getDesignations);
router.get("/locations", getLocations);

// --------------- Adding Data (protected) ---------------
router.post("/departments", verifyToken, addDepartments);
router.post("/designations", verifyToken, addDesignations);
router.post("/locations", verifyToken, addLocations);

module.exports = router;
