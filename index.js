require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // Move bodyParser require here
const app = express();
app.use(bodyParser.json());
//app.use(express.urlencoded());

app.use(cors());
const userRouter = require("./src/router/userRouter");
const pharmaRouter = require("./src/router/pharmaRouter");
const medRouter = require("./src/router/medRouter");
const authRouter = require("./src/router/auth");
const searchRouter = require("./src/router/search");
// Place bodyParser before the router middleware
//

app.use("/auth/v1", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/pharmacies", pharmaRouter);
app.use("/api/v1/medicines", medRouter);
app.use("/api/v1/search", searchRouter);

//starting server
app.listen(8000, () => {
  console.log("listening on port 8080");
});
