// const Course = require("../../models/Course");
// const StudentCourses = require("../../models/StudentCourses");

// const getAllStudentViewCourses = async (req, res) => {
//   try {
//     const {
//       category = [],
//       level = [],
//       primaryLanguage = [],
//       sortBy = "price-lowtohigh",
//     } = req.query;

//     console.log(req.query, "req.query");

//     let filters = {};
//     if (category.length) {
//       filters.category = { $in: category.split(",") };
//     }
//     if (level.length) {
//       filters.level = { $in: level.split(",") };
//     }
//     if (primaryLanguage.length) {
//       filters.primaryLanguage = { $in: primaryLanguage.split(",") };
//     }

//     let sortParam = {};
//     switch (sortBy) {
//       case "price-lowtohigh":
//         sortParam.pricing = 1;

//         break;
//       case "price-hightolow":
//         sortParam.pricing = -1;

//         break;
//       case "title-atoz":
//         sortParam.title = 1;

//         break;
//       case "title-ztoa":
//         sortParam.title = -1;

//         break;

//       default:
//         sortParam.pricing = 1;
//         break;
//     }

//     const coursesList = await Course.find(filters).sort(sortParam);

//     res.status(200).json({
//       success: true,
//       data: coursesList,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getStudentViewCourseDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const courseDetails = await Course.findById(id);

//     if (!courseDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "No course details found",
//         data: null,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: courseDetails,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const checkCoursePurchaseInfo = async (req, res) => {
//   try {
//     const { id, studentId } = req.params;
//     const studentCourses = await StudentCourses.findOne({
//       userId: studentId,
//     });

//     const ifStudentAlreadyBoughtCurrentCourse =
//       studentCourses.courses.findIndex((item) => item.courseId === id) > -1;
//     res.status(200).json({
//       success: true,
//       data: ifStudentAlreadyBoughtCurrentCourse,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// module.exports = {
//   getAllStudentViewCourses,
//   getStudentViewCourseDetails,
//   checkCoursePurchaseInfo,
// };
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
      page, // for pagination
    } = req.query;

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
        break;
    }

    let query = Course.find(filters).sort(sortParam);

    // ✅ Apply pagination only if "page" is passed
    let totalPages = 1;
    if (page) {
      const limit = 8;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);

      const totalRecords = await Course.countDocuments(filters);
      totalPages = Math.ceil(totalRecords / limit);
    }

    const coursesList = await query;

    res.status(200).json({
      success: true,
      data: coursesList,
      totalPages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};



const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


const checkCoursePurchaseInfo = async (req, res) => {
  try {
   
    const { id, studentId } = req.params;

    if (!id || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: id and studentId",
      });
    }

    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    if (!studentCourses) {
      return res.status(200).json({
        success: true,
        message: "Student has no purchased courses",
        data: false,
      });
    }

    const ifStudentAlreadyBoughtCurrentCourse =
      studentCourses.courses.some((item) => item.courseId === id);

    return res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.error("Error in checkCoursePurchaseInfo:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};



module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
