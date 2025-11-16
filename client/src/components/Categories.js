import React from "react";
import { Link } from "react-router-dom";

export default function Categories({ apps }) {
  const cats = Array.from(new Set(apps.map(a => a.category)));
  return (
    <div>
      <h2>Категории</h2>
      <div className="categoriesGrid">
        {cats.map(c => (
          <Link key={c} to={`/?category=${encodeURIComponent(c)}`} className="catCard">
            {c}
          </Link>
        ))}
      </div>
    </div>
  );
}
