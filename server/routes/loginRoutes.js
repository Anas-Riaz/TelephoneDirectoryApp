const express = require("express");
const {
  fetchingCredentials,
  registerAdmin,
} = require("../controllers/loginController.js");

const router = express.Router();

router.post("/login", fetchingCredentials);
router.post("/register", registerAdmin); // only use this for setup

module.exports = router;
