const Blog = require('../models/Blog');

// Get all blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new blog
const createBlog = async (req, res) => {
    const { title, content, author } = req.body;
    const newBlog = new Blog({ title, content, author });

    try {
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add a comment to a blog
const addComment = async (req, res) => {
    const { blogId } = req.params;
    const { text, author } = req.body;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        blog.comments.push({ text, author });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Like a blog
const likeBlog = async (req, res) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        blog.likes += 1;
        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getBlogs,
    createBlog,
    addComment,
    likeBlog,
};