import React from "react";
import { Link } from "react-router-dom";

export default function AppCard({ app, onLike, liked }) {
  return (
    <div className="card">
      <div className="cardTop">

        {app.icon ? (
          <img src={app.icon} alt={app.title} className="smallIcon" />
        ) : (
          <div className="icon">{app.title[0] ?? "A"}</div>
        )}

        <div className="meta">
          <Link to={`/app/${app.id}`} className="title">{app.title}</Link>
          <div className="subtitle">
            {app.developer} · {app.category}
          </div>
        </div>
      </div>

      <p className="desc">{app.description.slice(0, 90)}...</p>

      <div className="cardBottom">
        <div>⭐ {app.rating}</div>
        <div>{app.installs}</div>
        <div className="price">
          {app.price === 0 ? "Free" : `$${app.price}`}
        </div>
      </div>

      <div className="cardActions">
        <button
          onClick={() => onLike(app.id)}
          className={liked ? "btn liked" : "btn"}
        >
          {liked ? "♥" : "♡"}
        </button>

        <Link to={`/app/${app.id}`} className="btn primary">Открыть</Link>
      </div>
    </div>
  );
}
