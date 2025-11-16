import React, { useMemo } from "react";
import AppCard from "./AppCard";

export default function Home({ apps, likedMap, onLike, query }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.developer.toLowerCase().includes(q)
    );
  }, [query, apps]);

  const parseInstalls = (str) => {
    if (!str) return 0;
    let num = str.toLowerCase().replace("+", "").trim();

    if (num.endsWith("k")) return parseFloat(num) * 1000;
    if (num.endsWith("m")) return parseFloat(num) * 1000000;
    return parseInt(num) || 0;
  };

  const popularApps = [...filtered]
    .sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs))
    .slice(0, 4);

  const editorChoice = filtered.filter(app => app.editorChoice);

  return (
    <div className="pageFade">
      {editorChoice.length > 0 && (
        <>
          <h2 style={{ padding: "0 16px" }}>Выбор редакции</h2>
          <div className="grid">
            {editorChoice.map(app => (
              <AppCard
                key={app.id}
                app={app}
                liked={likedMap[app.id]}
                onLike={onLike}
              />
            ))}
          </div>
        </>
      )}

      <h2 style={{ padding: "0 16px" }}>Популярные приложения</h2>
      <div className="grid">
        {popularApps.map(app => (
          <AppCard
            key={app.id}
            app={app}
            liked={likedMap[app.id]}
            onLike={onLike}
          />
        ))}
      </div>

      <h2 style={{ padding: "0 16px" }}>Все приложения</h2>
      <div className="grid">
        {filtered.map(app => (
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
