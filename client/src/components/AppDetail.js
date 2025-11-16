import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GalleryModal from "./GalleryModal";
import ShareModal from "./ShareModal";
import { ls } from "../utils/storage";

export default function AppDetail({ apps, likedMap, onLike }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const app = apps.find((a) => String(a.id) === String(id));

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  if (app) {
    const history = ls.get("recent_views", []);
    const updated = [app, ...history.filter((x) => x.id !== app.id)].slice(0, 10);
    ls.set("recent_views", updated);
  }

  const recent = ls
    .get("recent_views", [])
    .filter((x) => String(x.id) !== String(id));

  const similar = apps
    .filter((a) => a.category === app?.category && a.id !== app.id)
    .slice(0, 4);

  const openGallery = (i) => {
    setGalleryIndex(i);
    setGalleryOpen(true);
  };

  if (!app) {
    return (
      <div className="detail pageFade">
        <button className="backBtnPretty" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="detail pageFade">
      <button className="backBtnPretty" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="detailTop">
        {app.icon ? (
          <img src={app.icon} alt={app.title} className="bigIcon" />
        ) : (
          <div className="bigIcon">{app.title[0]}</div>
        )}

        <div className="detailMeta">
          <h2>{app.title}</h2>
          <div className="subtitle">{app.developer}</div>
          <div className="rating">⭐ {app.rating}</div>
        </div>
      </div>

      <p className="descFull">{app.description}</p>

      <div className="actionsRow">
        <button
          className={likedMap[app.id] ? "btn liked" : "btn"}
          onClick={() => onLike(app.id)}
        >
          {likedMap[app.id] ? "♥ Удалить" : "♡ В избранное"}
        </button>

        <button className="btn primary">Установить</button>

        <button className="btn shareOpenBtn" onClick={() => setShareOpen(true)}>
          🔗 Поделиться находкой
        </button>
      </div>

      <h3>Скриншоты</h3>
      <div className="screensRowHorizontal">
        {app.screenshots?.length ? (
          app.screenshots.map((src, i) => (
            <img
              key={i}
              className="screenshot"
              src={src}
              onClick={() => openGallery(i)}
            />
          ))
        ) : (
          <p>Нет скриншотов</p>
        )}
      </div>

      <div className="recommend">
        <h3>Похожие</h3>

        {!similar.length ? (
          <p style={{ color: "#666" }}>Нет похожих приложений</p>
        ) : (
          <div className="smallGrid">
            {similar.map((a) => (
              <div key={a.id} className="smallCard">
                {a.icon ? (
                  <img src={a.icon} className="smallIcon" />
                ) : (
                  <div className="smallIcon">{a.title[0]}</div>
                )}
                <a href={`/app/${a.id}`}>{a.title}</a>
              </div>
            ))}
          </div>
        )}

        <h3 style={{ marginTop: 25 }}>Вы недавно смотрели</h3>

        <div className="smallGrid">
          {recent.length ? (
            recent.map((a) => (
              <div key={a.id} className="smallCard">
                {a.icon ? (
                  <img src={a.icon} className="smallIcon" />
                ) : (
                  <div className="smallIcon">{a.title[0]}</div>
                )}
                <a href={`/app/${a.id}`}>{a.title}</a>
              </div>
            ))
          ) : (
            <p>История пуста</p>
          )}
        </div>
      </div>

      {galleryOpen && (
        <GalleryModal
          images={app.screenshots}
          index={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {shareOpen && <ShareModal app={app} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
