import { useEffect, useState } from 'react';
import axios from 'axios';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/blogs');
                setBlogs(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to fetch blogs');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
    <h2 className="text-3xl font-bold mb-4">Blog List</h2>
    {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
    ) : (
        <ul className="space-y-4">
            {blogs.map(blog => (
                <li key={blog._id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
                    <h3 className="text-xl font-semibold">{blog.title}</h3>
                    <p className="mt-2 text-gray-700">{blog.content}</p>
                    <p className="mt-2">
                        <strong>Author:</strong> <span className="text-gray-600">{blog.author}</span>
                    </p>
                    <p className="mt-1">
                        <strong>Likes:</strong> <span className="text-gray-600">{blog.likes}</span>
                    </p>
                    <p className="mt-1">
                        <strong>Comments:</strong> <span className="text-gray-600">{blog.comments.length}</span>
                    </p>
                    <hr className="my-4 border-gray-300" />
                </li>
            ))}
        </ul>
    )}
</div>
    );
};

export default BlogList;