import React, { useEffect, useState } from "react";

export default function GalleryModal({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const [animClass, setAnimClass] = useState("galleryIn");

  const prev = () => {
    setAnimClass("gallerySlideLeft");
    setTimeout(() => {
      setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
      setAnimClass("galleryIn");
    }, 250);
  };

  const next = () => {
    setAnimClass("gallerySlideRight");
    setTimeout(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
      setAnimClass("galleryIn");
    }, 250);
  };

  const close = () => {
    setAnimClass("galleryOut");
    setTimeout(() => onClose(), 200);
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="galleryOverlay" onClick={close}>
      <div className={`galleryContent animated ${animClass}`} onClick={(e) => e.stopPropagation()}>
        <img src={images[current]} alt="" className="galleryImage" />

        <button className="galleryBtn left" onClick={prev}>‹</button>
        <button className="galleryBtn right" onClick={next}>›</button>

        <button className="galleryClose" onClick={close}>×</button>
      </div>
    </div>
  );
}
