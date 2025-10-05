import React, { useEffect, useRef, useState } from "react";
// import CommentDrawer from "./CommentDrawer.jsx";
import "../styles/comments.css";
import CommentDrawer from "./CommentDrawer";


const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = "No videos yet." }) => {
  const videoRefs = useRef(new Map());
  const [activeFoodId, setActiveFoodId] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    );

    videoRefs.current.forEach((vid) => observer.observe(vid));
    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return; }
    videoRefs.current.set(id, el);
  };

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {items.length === 0 && <div className="empty-state">{emptyMessage}</div>}

        {items.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              poster={item.video ? `${item.video}?tr=w-300,h-300,fo-auto` : "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"}
              muted
              playsInline
              loop
              preload="metadata"
            />
            <p style={{fontSize:"2rem",color:"red"}}>{item.name}</p>

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />
              <div className="reel-actions">
                {/* LIKE */}
                <div className="reel-action-group">
                  <button onClick={() => onLike?.(item)} className="reel-action" aria-label="Like"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" /> </svg></button>
                  <div className="reel-action__count">{item.likeCount}</div>
                </div>
                {/* SAVE */}
                <div className="reel-action-group">
                  <button onClick={() => onSave?.(item)} className="reel-action" aria-label="Bookmark"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" /> </svg></button>
                  <div className="reel-action__count">{item.savesCount}</div>
                </div>
                {/* COMMENTS */}
                <div className="reel-action-group">
                  <button
                    onClick={() => setActiveFoodId(item._id)}
                    className="reel-action"
                  >
                    💬
                  </button>
                  <div className="reel-action__count">{item.commentsCount}</div>
                </div>
              </div>

              <div className="reel-content">
                <h2 className="reel-name">{item.name}</h2>
                <p className="reel-description">{item.description}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Comments Drawer */}
      <CommentDrawer
        foodId={activeFoodId}
        isOpen={!!activeFoodId}
        onClose={() => setActiveFoodId(null)}
      />
    </div>
  );
};

export default ReelFeed;
