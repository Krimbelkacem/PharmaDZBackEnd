const express = require("express");
const bcrypt = require("bcrypt");
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "Pharma_dz",
    //port: 3307,
  },
});

const userRouter = express.Router();

userRouter.get("/user", async (req, res) => {
  try {
    // Fetch user information from the database using req.user.userId
    console.log(req.query.userId);
    const user = await knex("users")
      .where("user_id", req.query.userId)
      .where("isarchived", false)
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.get("/userslist", async (req, res) => {
  try {
    // Fetch users from the database who are not archived
    const notArchivedUsers = await knex("users")
      .where("isarchived", false)
      .select("*");

    res.json(notArchivedUsers);
  } catch (error) {
    console.error("Error fetching not archived users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.put("/users/edit/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password, is_admin, idpharmacie, isarchived } =
    req.body;

  try {
    // Check if the user with the given userId exists
    const existingUser = await knex("users").where("user_id", userId).first();
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare the updated user data
    const updatedUserData = {};
    if (username) updatedUserData.username = username;
    if (email) updatedUserData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUserData.password = hashedPassword;
    }
    if (typeof is_admin !== "undefined") updatedUserData.is_admin = is_admin;
    if (idpharmacie) updatedUserData.idpharmacie = idpharmacie;
    if (typeof isarchived !== "undefined")
      updatedUserData.isarchived = isarchived;

    // Update the user in the database
    await knex("users").where("user_id", userId).update(updatedUserData);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = userRouter;
