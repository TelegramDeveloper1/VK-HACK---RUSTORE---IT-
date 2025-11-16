import React from "react";
import AppCard from "./AppCard";

export default function FavoriteApps({ apps, likedMap, onLike }) {
  const favs = apps.filter((a) => likedMap[a.id]);

  return (
    <div className="pageFade" style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Избранное</h2>

      <div className="grid">
        {favs.length === 0 && <p>Избранных приложений пока нет</p>}

        {favs.map((app) => (
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
