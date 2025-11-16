import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ query, setQuery, setShowOnboard }) {
  const nav = useNavigate();

  return (
    <header className="header">
      <div className="headerRow">
        <div className="brand" onClick={() => nav("/")}>
          RuStore — Demo
        </div>

        <nav className="navButtons">
          <Link to="/aiagent" className="navBtn">Спросить у ИИ</Link>
          <Link to="/categories" className="navBtn">Категории</Link>
          <Link to="/favorites" className="navBtn">Избранное</Link>
        </nav>
      </div>

      <div className="searchBox">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск приложений..."
        />
      </div>
    </header>
  );
}
