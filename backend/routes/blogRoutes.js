const express = require('express');
const {
    getBlogs,
    createBlog,
    addComment,
    likeBlog,
} = require('../controllers/blogController');

const router = express.Router();

router.get('/', getBlogs);
router.post('/', createBlog);
router.post('/:blogId/comments', addComment);
router.post('/:blogId/like', likeBlog);

module.exports = router;