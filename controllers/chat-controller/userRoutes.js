const express = require("express");
const router = express.Router();
const User = require("../../models/User"); // Adjust the path as necessary

// GET /api/users/instructors
router.get("/instructors", async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select("userName _id");
    res.status(200).json(instructors);
  } catch (err) {
    console.error("Error fetching instructors:", err);
    res.status(500).json({ message: "Server error while fetching instructors" });
  }
});

router.get("/students",async(req,res)=>{
  try{
    const students = await User.find({ role: "user" }).select("userName _id");
    res.status(200).json(students);
  }
  catch(err){
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error while fetching students" });
  }
})
module.exports = router;
