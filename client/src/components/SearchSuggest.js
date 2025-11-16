export default function SearchSuggest({ query, apps, onSelect }) {
  const q = query.toLowerCase().trim();

  const results = apps.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.developer.toLowerCase().includes(q)
  ).slice(0, 7);

  if (!results.length) {
    return (
      <div className="searchDropdown">
        <div className="searchItem empty">Ничего не найдено</div>
      </div>
    );
  }

  return (
    <div className="searchDropdown">
      {results.map(app => (
        <div
          key={app.id}
          className="searchItem"
          onMouseDown={() => onSelect(app.id)}
        >
          <div className="searchIcon">{app.title[0]}</div>
          <div className="searchText">
            <div className="searchTitle">{app.title}</div>
            <div className="searchSub">{app.developer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
