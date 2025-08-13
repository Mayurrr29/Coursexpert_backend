const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/skillfeb");
 await mongoose.connect("mongodb+srv://mayur_2002:Mayur%402%402@cluster0.dwzasac.mongodb.net/Coursexpert?retryWrites=true&w=majority&appName=Cluster0");
    console.log("DB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// ✅ Correctly exporting the function
module.exports = connectDB;
