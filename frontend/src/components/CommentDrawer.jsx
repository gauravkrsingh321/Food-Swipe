import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/comments.css";

const CommentDrawer = ({ foodId, isOpen, onClose }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isOpen || !foodId) return;
    

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/food/comments/${foodId}`, { withCredentials: true });
        if (res.data.success) setComments(res.data.comments);
      } catch (err) {
        console.error("Error fetching comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [isOpen, foodId,baseUrl]);

  const handleAddComment = async () => {
    if (!text.trim()) return;
    try {
      console.log("Sending comment", { text, foodId });
      const res = await axios.post(`${baseUrl}/api/food/comment/${foodId}`, { text }, { withCredentials: true });
      setComments((prev) => [res.data.comment, ...prev]);
      setText("");
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
       await axios.delete(`${baseUrl}/api/food/comment/${commentId}`, { withCredentials: true });
        // filter out the deleted comment from state
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comments-drawer-backdrop" onClick={onClose}>
      <div className="comments-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <h3>Comments</h3>
          <button className="close-btn" onClick={onClose}>❌</button>
        </div>
        <div className="comments-body">
          {loading ? (
            <p>Loading...</p>
          ) : comments.length === 0 ? (
            <p className="comment-user">No Comments Yet</p>
          ) : (
            <div className="comments-container">
  {comments.map((c) => (
    <div key={c._id} className="comment-item">
      <div className="comment-header">
        <span className="comment-user">{c.user?.fullName || "Anonymous"}</span>
        <button
          className="del-comment-btn"
          onClick={() => handleDeleteComment(c._id)}
        >
          ✖
        </button>
      </div>
      <p className="comment-text">{c.text}</p>
    </div>
  ))}
</div>

          )}
        </div>
        <div className="comments-footer">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default CommentDrawer;
