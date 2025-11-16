// import React, { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";

// import Header from "./components/Header";
// import Home from "./components/Home";
// import AIAGENT from "./components/AI";
// import AppDetail from "./components/AppDetail";
// import CategoryList from "./components/CategoryList";
// import CategoryApps from "./components/CategoryApps";
// import FavoriteApps from "./components/FavoriteApps";
// import Onboarding from "./components/Onboarding";

// import { ls } from "./utils/storage";

// export default function App() {
//   const [apps, setApps] = useState([]);
//   const [likedMap, setLikedMap] = useState(ls.get("likes", {}));
//   const [query, setQuery] = useState("");

//   const [showOnboard, setShowOnboard] = useState(
//     !ls.get("seen_onboarding", false)
//   );
//   // const [showOnboard, setShowOnboard] = useState(true);

//   useEffect(() => {
//     fetch("/apps.json")
//       .then((response) => response.json())
//       .then((data) => setApps(data))
//       .catch((error) =>
//         console.error("Ошибка загрузки apps.json:", error)
//       );
//   }, []);

//   function toggleLike(id) {
//     const updated = { ...likedMap, [id]: !likedMap[id] };
//     setLikedMap(updated);
//     ls.set("likes", updated);
//   }

//   return (
//     <>
//       <Header
//         query={query}
//         setQuery={setQuery}
//         setShowOnboard={setShowOnboard}
//       />

//       {showOnboard && (
//         <Onboarding onClose={() => setShowOnboard(false)} />
//       )}

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home
//               apps={apps}
//               likedMap={likedMap}
//               onLike={toggleLike}
//               query={query}
//             />
//           }
//         />

//         <Route
//           path="/app/:id"
//           element={
//             <AppDetail
//               apps={apps}
//               likedMap={likedMap}
//               onLike={toggleLike}
//             />
//           }
//         />

//         <Route path="/categories" element={<CategoryList apps={apps} />} />

//         <Route
//           path="/categories/:name"
//           element={
//             <CategoryApps
//               apps={apps}
//               likedMap={likedMap}
//               onLike={toggleLike}
//             />
//           }
//         />

//         <Route
//           path="/favorites"
//           element={
//             <FavoriteApps
//               apps={apps}
//               likedMap={likedMap}
//               onLike={toggleLike}
//             />
//           }
//         />

//         <Route
//           path="/aiagent"
//           element={
//             <FavoriteApps
//               apps={apps}
//               likedMap={likedMap}
//               onLike={toggleLike}
//             />
//           }
//         />

//       </Routes>

//     </>
//   );
// }



































import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import AIAGENT from "./components/AI";  // Убедись что этот импорт правильный
import AppDetail from "./components/AppDetail";
import CategoryList from "./components/CategoryList";
import CategoryApps from "./components/CategoryApps";
import FavoriteApps from "./components/FavoriteApps";
import Onboarding from "./components/Onboarding";

import { ls } from "./utils/storage";

export default function App() {
  const [apps, setApps] = useState([]);
  const [likedMap, setLikedMap] = useState(ls.get("likes", {}));
  const [query, setQuery] = useState("");

  const [showOnboard, setShowOnboard] = useState(
    !ls.get("seen_onboarding", false)
  );

  useEffect(() => {
    fetch("/apps.json")
      .then((response) => response.json())
      .then((data) => setApps(data))
      .catch((error) =>
        console.error("Ошибка загрузки apps.json:", error)
      );
  }, []);

  function toggleLike(id) {
    const updated = { ...likedMap, [id]: !likedMap[id] };
    setLikedMap(updated);
    ls.set("likes", updated);
  }

  return (
    <>
      <Header
        query={query}
        setQuery={setQuery}
        setShowOnboard={setShowOnboard}
      />

      {showOnboard && (
        <Onboarding onClose={() => setShowOnboard(false)} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              apps={apps}
              likedMap={likedMap}
              onLike={toggleLike}
              query={query}
            />
          }
        />

        <Route
          path="/app/:id"
          element={
            <AppDetail
              apps={apps}
              likedMap={likedMap}
              onLike={toggleLike}
            />
          }
        />

        <Route path="/categories" element={<CategoryList apps={apps} />} />

        <Route
          path="/categories/:name"
          element={
            <CategoryApps
              apps={apps}
              likedMap={likedMap}
              onLike={toggleLike}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <FavoriteApps
              apps={apps}
              likedMap={likedMap}
              onLike={toggleLike}
            />
          }
        />

        {/* 🔥 ИСПРАВЛЕННЫЙ РОУТ ДЛЯ AI */}
        <Route
          path="/aiagent"
          element={
            <AIAGENT
              apps={apps}
              likedMap={likedMap}
              onLike={toggleLike}
            />
          }
        />

      </Routes>
    </>
  );
}