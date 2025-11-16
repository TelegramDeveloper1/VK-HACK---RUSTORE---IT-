import React from "react";
import { Link } from "react-router-dom";

export default function CategoryList({ apps }) {
  const categories = [...new Set(apps.map((a) => a.category))];

  return (
    <div className="pageFade categoryList">
      <h2 className="pageTitle">Категории</h2>

      <div className="categoryContainer">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/categories/${cat}`}
            className="categoryItem"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}
