import { useState } from 'react';

const CommentForm = ({ blogId }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send the comment to the backend
        await fetch(`/api/blogs/${blogId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: comment, author: 'User  ' }) // Replace 'User  ' with actual user info
        });
        setComment(''); // Clear the input after submission
        // Optionally, refresh the comments or handle them in the parent component
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="border p-2 w-full"
                rows="3"
                required
            />
            <button type="submit" className="bg-blue-500 text-white px-2 py-1 mt-2">
                Submit Comment
            </button>
        </form>
    );
};

export default CommentForm;