import { useState } from 'react';
import CommentForm from './CommentForm';

const Blog = ({ blog }) => {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className="border p-4 mb-4">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p>{blog.content}</p>
            <p className="text-sm">By {blog.author} on {new Date(blog.date).toLocaleDateString()}</p>
            <button className="bg-blue-500 text-white px-2 py-1 mt-2" onClick={() => setShowComments(!showComments)}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            <div>
                <button className="bg-green-500 text-white px-2 py-1 mt-2">Like</button>
                <span className="ml-2">{blog.likes} likes</span>
            </div>
            {showComments && (
                <div>
                    <CommentForm blogId={blog._id} />
                    {blog.comments.map(comment => (
                        <div key={comment._id} className="border-t mt-2 pt-2">
                            <p>{comment.text} - <strong>{comment.author}</strong></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;