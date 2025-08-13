const express = require('express');
const router = express.Router();
const {createComment,replyToComment,getCourseComments,getAdminComments} = require('../controllers/commentController');
const { authenticate, isAdmin } = require('../middleware/auth-middleware');

// User comments
router.post('/', authenticate, createComment);

// Admin replies to a comment
router.patch('/:id/reply', authenticate, isAdmin,replyToComment);

// Get commetns for Admin 
router.get('/allcomments',getAdminComments);

// Get comments for a course
router.get('/course/:courseId',getCourseComments);

module.exports = router;
