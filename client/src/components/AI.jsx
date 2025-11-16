import React, { useState, useEffect } from 'react';
import './AI.css';

const AIAGENT = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка приложений по поисковому запросу
  const fetchApps = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      console.log('🔍 Отправляем запрос:', query);
      const response = await fetch(`http://localhost:8000/ai/ask?message=${encodeURIComponent(query)}`);
      
      console.log('📡 Статус ответа:', response.status);
      const data = await response.json();
      console.log('📦 Полученные данные:', data);
      
      // 🔥 ИСПРАВЛЕНИЕ: сервер возвращает массив, а не объект с apps
      setApps(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  // Поиск при нажатии Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchApps(searchQuery);
    }
  };

  return (
    <div className="ai-agent">
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Например: карты для бега, головоломки для детей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button 
            onClick={() => fetchApps(searchQuery)}
            disabled={loading}
            className="search-button"
          >
            {loading ? '🔍 Поиск...' : '🎯 Найти приложения'}
          </button>
        </div>
      </div>

      {/* 📱 Список приложений */}
      <div className="apps-container">
        {loading ? (
          <div className="loading">Загружаем рекомендации...</div>
        ) : apps.length > 0 ? (
          <>
            <div className="results-info">
              Найдено {apps.length} приложений
            </div>
            <div className="apps-grid">
              {apps.map((app, index) => (
                <AppCard key={app.id || index} app={app} index={index} />
              ))}
            </div>
          </>
        ) : searchQuery ? (
          <div className="no-results">
            😔 Не найдено приложений по вашему запросу
          </div>
        ) : (
          <div className="welcome">
            👋 Введите запрос для поиска приложений
          </div>
        )}
      </div>
    </div>
  );
};

// 🎴 Компонент карточки приложения
const AppCard = ({ app, index }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`app-card ${app.relevance_score > 0 ? 'highlighted' : ''}`}>
      {/* 🏆 Бейдж релевантности */}
      {app.relevance_score > 0 && (
        <div className="relevance-badge">
        </div>
      )}

      {/* 🖼️ Изображение приложения */}
      <div className="app-image-container">
        <img
          src={imageError ? '/placeholder-app.png' : app.picture}
          alt={app.name}
          className="app-image"
          onError={() => setImageError(true)}
        />
      </div>

      {/* 📝 Информация о приложении */}
      <div className="app-info">
        <h3 className="app-name">{app.name}</h3>
        
        <div className="app-meta">
          <span className="category">{app.category}</span>
          <span className="age-rating">{app.age_rating}</span>
        </div>

        {/* 🏷️ Теги */}
        <div className="tags-container">
          {app.tags && app.tags.map((tag, tagIndex) => (
            <span 
              key={tagIndex} 
              className={`tag ${app.relevance_score > 0 ? 'relevant-tag' : ''}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 📊 Статистика релевантности */}
        {app.relevance_score > 0 && (
          <div className="relevance-stats">
            <div className="score-bar">
              <div 
                className="score-fill"
                style={{ width: `${app.match_percentage}%` }}
              ></div>
            </div>
            <div className="score-text">
              Совпало {app.relevance_score} тегов
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAGENT;