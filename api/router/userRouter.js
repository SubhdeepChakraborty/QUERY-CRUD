const router = require("express").Router();
const User = require("../model/user.js");

//Get all Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(403).json("Something went wrong");
  }
});

//Add Users
router.post("/add/user", async (req, res) => {
  const { email, name, gender, status, profilePic } = req.body;
  try {
    const newUser = new User({
      email,
      name,
      status,
      profilePic,
      gender,
    });

    const user = await newUser.save();
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: "Somethng isn't good" });
  }
});

//Get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: "Somethng isn't good" });
  }
});

//Update
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Only your account can be updated." });
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
