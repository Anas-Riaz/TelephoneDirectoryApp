require("dotenv").config();
const express = require("express")
const cors = require("cors")
const adminRoutes = require("./routes/adminRoutes.js")
const dropdownRoutes = require("./routes/dropdownRoutes.js")
const loginRoutes = require("./routes/loginRoutes.js")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/dropdowns", dropdownRoutes);
app.use("/api/search", adminRoutes);
app.use("/api/auth", loginRoutes)

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
