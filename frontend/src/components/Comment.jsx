const Comment = ({ comment }) => {
    return (
        <div className="border-t mt-2 pt-2">
            <p>
                {comment.text} - <strong>{comment.author}</strong>
            </p>
        </div>
    );
};

export default Comment;