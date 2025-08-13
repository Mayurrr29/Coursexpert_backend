const Comment = require('../models/Comment');

// POST user comment
const createComment = async (req, res) => {
  const { courseId,userId,content } = req.body;

  console.log(req.body); // Debugging line to check incoming data
  
  // 1. Basic validation
  if (!courseId || !content?.trim()) {
    return res.status(400).json({ error: 'Course ID and content are required' });
  }

  // 2. Check if user is authenticated
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user info found' });
  }

  try {
    const newComment = await Comment.create({
      courseId,
      userId,
      content: content.trim(),
    });

    // 3. Emit socket event safely
    const io = req.app.get('io');
    if (io) {
      io.emit('new-comment', newComment);
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error in createComment:", error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};


// GET course comments
const getCourseComments = async (req, res) => {
  try {
    const comments = await Comment.find({ courseId: req.params.courseId })
      .populate('userId', 'userName')
      .sort({ createdAt: -1 });
    res.json(comments);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

//get admin comments 

const getAdminComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('courseId', 'title description')  // fixed
      .populate('userId', 'userName email');          // fixed

    res.json(comments);
  } catch (error) {
    console.error("Error in getAdminComments:", error);
    res.status(500).json({ error: 'Failed to fetch admin comments hello' });
  }
};


// PATCH admin reply
const replyToComment = async (req, res) => {
  const { content } = req.body;

  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        reply: {
          content,
          createdAt: new Date(),
          adminId: req.user.id
        }
      },
      { new: true }
    );

    // Send reply to specific user
    req.app.get('io').to(updated.userId.toString()).emit('admin-replied', updated);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Reply failed' });
  }
};

module.exports = {
  createComment,
  getCourseComments,
  replyToComment,
  getAdminComments,
};
