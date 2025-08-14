// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const http = require("http");
// const { Server } = require("socket.io");
// const connectDB = require("./database/db");

// // Models
// const User = require("./models/User"); // <-- Import User model

// // Routes
// const authRoutes = require("./routes/auth-routes/index");
// const mediaRoutes = require("./routes/instructor-routes/media-routes");
// const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
// const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
// const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
// const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
// const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
// const commentRoutes = require("./routes/commentRoutes");
// const chatRoute = require("./routes/chat-routes/chatRoutes");
// const messageRoute = require("./routes/chat-routes/messageRoutes");
// const userRoutes = require("../server/controllers/chat-controller/userRoutes");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PATCH"],
//   },
// });

// app.set("io", io);
// const PORT = process.env.PORT || 5000;

// // Connect to DB
// connectDB();

// // CORS setup
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.options("*", cors());

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/auth", authRoutes);
// app.use("/media", mediaRoutes);
// app.use("/instructor/course", instructorCourseRoutes);
// app.use("/student/course", studentViewCourseRoutes);
// app.use("/student/order", studentViewOrderRoutes);
// app.use("/student/courses-bought", studentCoursesRoutes);
// app.use("/student/course-progress", studentCourseProgressRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/chat", chatRoute);
// app.use("/api/message", messageRoute);
// app.use("/api/users", userRoutes);

// // ===== SOCKET.IO EVENTS =====
// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);

//   // Store current user ID for cleanup on disconnect
//   let currentUserId = null;

//   // Join room with userId and mark online
//   socket.on("join", async (userId) => {
//     try {
//       currentUserId = userId;
//       socket.join(userId);

//       // Update DB to set online status
//       await User.findByIdAndUpdate(userId, { 
//         isOnline: true
//       });
      
//       // Broadcast online status to all connected clients
//       io.emit("user-status", { 
//         userId, 
//         isOnline: true, 
//         lastSeen: User.lastSeen || null 
//       });
      
//       console.log(`✅ User ${userId} is now online`);
//     } catch (error) {
//       console.error("Join error:", error);
//     }
//   });

//   // Handle sending message
//   socket.on("send-message", ({ receiverId, message }) => {
//     io.to(receiverId).emit("new-message", message);
//   });

//   // Disconnect handler
//   socket.on("disconnect", async () => {
//     try {
//       console.log("🔴 Client disconnected:", socket.id);
//       if (currentUserId) {
//         const lastSeen = new Date();
//         console.log(`User ${currentUserId} disconnected at ${lastSeen}`);
//         await User.findByIdAndUpdate(currentUserId, {
//           isOnline: false,
//           lastSeen
//         });
//         // Broadcast offline status to all connected clients
//         io.emit("user-status", { 
//           userId: currentUserId, 
//           isOnline: false, 
//           lastSeen
//         });
        
     
//       }
//     } catch (error) {
//       console.error("Disconnect error:", error);
//     }
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Something went wrong",
//   });
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./database/db");

// Models
const User = require("./models/User");

// Routes
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const commentRoutes = require("./routes/commentRoutes");
const chatRoute = require("./routes/chat-routes/chatRoutes");
const messageRoute = require("./routes/chat-routes/messageRoutes");
const userRoutes = require("./controllers/chat-controller/userRoutes");

const app = express();
const server = http.createServer(app);

// ✅ Use environment variable for frontend origin in production

const io = new Server(server, {
  cors: {
    origin: "https://coursexpert.vercel.app",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

// ✅ Use Railway PORT environment variable
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB(process.env.MONGO_URI);

// CORS setup for API
app.use(
  cors({
    origin: "https://coursexpert.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/users", userRoutes);

// ===== SOCKET.IO EVENTS =====
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  let currentUserId = null;

  socket.on("join", async (userId) => {
    try {
      currentUserId = userId;
      socket.join(userId);
      await User.findByIdAndUpdate(userId, { isOnline: true });

      io.emit("user-status", {
        userId,
        isOnline: true,
        lastSeen: User.lastSeen || null,
      });

      console.log(`✅ User ${userId} is now online`);
    } catch (error) {
      console.error("Join error:", error);
    }
  });

  socket.on("send-message", ({ receiverId, message }) => {
    io.to(receiverId).emit("new-message", message);
  });

  socket.on("disconnect", async () => {
    try {
      console.log("🔴 Client disconnected:", socket.id);
      if (currentUserId) {
        const lastSeen = new Date();
        await User.findByIdAndUpdate(currentUserId, {
          isOnline: false,
          lastSeen,
        });
        io.emit("user-status", {
          userId: currentUserId,
          isOnline: false,
          lastSeen,
        });
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
