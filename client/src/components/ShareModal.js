import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function ShareModal({ app, onClose }) {
  const cardRef = useRef(null);

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = `${app.title}_share.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyImage = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    canvas.toBlob(async (blob) => {
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob })
      ]);
      alert("Скопировано!");
    });
  };

  return (
    <div className="shareOverlay" onClick={onClose}>
      <div className="shareModal" onClick={(e) => e.stopPropagation()}>
        <button className="shareClose" onClick={onClose}>×</button>

        <div className="shareCard" ref={cardRef}>
          <img src={app.icon} alt="" className="shareIcon" />
          <h3 className="shareTitle">{app.title}</h3>
          <p className="shareDev">{app.developer}</p>
          <p className="shareDesc">{app.description}</p>
        </div>

        <div className="shareActions">
          <button className="shareBtn" onClick={copyImage}>📋 Копировать</button>
          <button className="shareBtn" onClick={downloadImage}>⬇ Скачать</button>
        </div>
      </div>
    </div>
  );
}
