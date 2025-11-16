import React from "react";
import AppCard from "./AppCard";
import { useParams } from "react-router-dom";

export default function CategoryApps({ apps, likedMap, onLike }) {
  const { name } = useParams();

  const filtered = apps.filter(
    (a) => a.category.toLowerCase() === name.toLowerCase()
  );

  return (
    <div className="pageFade" style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>{name}</h2>

      <div className="grid">
        {filtered.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            liked={likedMap[app.id]}
            onLike={onLike}
          />
        ))}
      </div>
    </div>
  );
}
