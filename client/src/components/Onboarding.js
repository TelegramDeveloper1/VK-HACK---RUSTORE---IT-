import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ls } from "../utils/storage";

export default function Onboarding({ onClose }) {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Добро пожаловать",
      text: "Добро пожаловать в RuStore! Откройте для себя мир российских приложений.",
      selector: ".brand",
      route: "/"
    },
    {
      title: "Поиск",
      text: "Используйте строку поиска, чтобы быстро найти приложение по названию или разработчику.",
      selector: ".searchBox input",
      route: "/"
    },
    {
      title: "Категории",
      text: "Здесь можно открыть список категорий и отфильтровать витрину.",
      selector: ".navBtn[href='/categories']",
      route: "/"
    },
    {
      title: "Карточки приложений",
      text: "Каждая карточка содержит иконку, название, рейтинг и кнопку подробностей.",
      selector: ".grid .card",
      route: "/"
    },
    {
      title: "Скриншоты",
      text: "В карточке приложения можно открыть скриншоты в полноэкранной галерее.",
      selector: ".screenshot, .screensRow img",
      route: "/"
    }
  ];

  const [index, setIndex] = useState(0);
  const highlightRef = useRef(null);
  const mountedRef = useRef(true);

  const highlightElement = (selector) => {
    document.querySelectorAll(".onboard-highlight").forEach((el) =>
      el.classList.remove("onboard-highlight")
    );

    if (!selector) return;

    const tryFind = () =>
      new Promise((resolve) => {
        let tries = 0;

        const attempt = () => {
          if (!mountedRef.current) return resolve(null);

          const parts = selector.split(",").map((s) => s.trim());
          let el = null;

          for (const sel of parts) {
            el = document.querySelector(sel);
            if (el) break;
          }

          if (el) {
            el.classList.add("onboard-highlight");

            try {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            } catch {}

            highlightRef.current = el;
            return resolve(el);
          }

          tries++;
          if (tries >= 8) return resolve(null);

          setTimeout(attempt, 250);
        };

        attempt();
      });

    return tryFind();
  };

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const step = steps[index];

    async function run() {
      if (step.route) {
        navigate(step.route);
        await new Promise((res) => setTimeout(res, 250));
      }
      if (!cancelled) highlightElement(step.selector);
    }

    run();

    return () => {
      cancelled = true;
      document.querySelectorAll(".onboard-highlight").forEach((el) =>
        el.classList.remove("onboard-highlight")
      );
    };
  }, [index, navigate, steps]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const finish = () => {
    ls.set("seen_onboarding", true);
    document.querySelectorAll(".onboard-highlight").forEach((el) =>
      el.classList.remove("onboard-highlight")
    );
    if (onClose) onClose();
  };

  const skip = () => finish();

  const handleStart = () => {
    navigate("/");
    finish();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter")
        setIndex((i) => Math.min(steps.length - 1, i + 1));
      if (e.key === "ArrowLeft")
        setIndex((i) => Math.max(0, i - 1));
      if (e.key === "Escape") skip();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [steps.length]);

  return (
    <div className="onboard-backdrop">
      <div className="onboard-card" onClick={(e) => e.stopPropagation()}>
        <img src="/onboarding/RuStore_logo.png" alt="RuStore" className="onboard-logo" />

        <h2 className="onboard-title">{steps[index].title}</h2>
        <p className="onboard-text">{steps[index].text}</p>

        <div className="onboard-controls">
          <button
            className="onboard-btn"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Назад
          </button>

          {index < steps.length - 1 ? (
            <button
              className="onboard-btn primary"
              onClick={() => setIndex((i) => i + 1)}
            >
              Далее
            </button>
          ) : (
            <button className="onboard-btn primary" onClick={handleStart}>
              Начать
            </button>
          )}
        </div>

        <div className="onboard-footer">
          <div className="dots">
            {steps.map((_, i) => (
              <span key={i} className={`dot ${i === index ? "active" : ""}`} />
            ))}
          </div>

          <button className="onboard-skip" onClick={skip}>
            Пропустить
          </button>
        </div>
      </div>
    </div>
  );
}
