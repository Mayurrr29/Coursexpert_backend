// const User = require("../../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const registerUser = async (req, res) => {
//   const { userName, userEmail, password, role } = req.body;

//   const existingUser = await User.findOne({
//     $or: [{ userEmail }, { userName }],
//   });

//   if (existingUser) {
//     return res.status(400).json({
//       success: false,
//       message: "User name or user email already exists",
//     });
//   }

//   const hashPassword = await bcrypt.hash(password, 10);
//   const newUser = new User({
//     userName,
//     userEmail,
//     role,
//     password: hashPassword,
//   });

//   await newUser.save();

//   return res.status(201).json({
//     success: true,
//     message: "User registered successfully!",
//   });
// };

// const loginUser = async (req, res) => {
//   const { userEmail, password } = req.body;

//   const checkUser = await User.findOne({ userEmail });

//   if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid credentials",
//     });
//   }

//   const accessToken = jwt.sign(
//     {
//       _id: checkUser._id,
//       userName: checkUser.userName,
//       userEmail: checkUser.userEmail,
//       role: checkUser.role,
//     },
//     "JWT_SECRET",
//     { expiresIn: "120m" }
//   );

//   res.status(200).json({
//     success: true,
//     message: "Logged in successfully",
//     data: {
//       accessToken,
//       user: {
//         _id: checkUser._id,
//         userName: checkUser.userName,
//         userEmail: checkUser.userEmail,
//         role: checkUser.role,
//       },
//     },
//   });
// };

// module.exports = { registerUser, loginUser };



const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    // 1. Field presence checks
    if (!userName || !userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (userName, userEmail, password) are required",
      });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 3. Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or user email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      userEmail,
      role: role || "user",
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    // 1. Field presence check
    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required",
      });
    }

    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      "JWT_SECRET",
      { expiresIn: "2h" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports = { registerUser, loginUser };
