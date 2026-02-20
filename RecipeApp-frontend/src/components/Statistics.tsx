import { useState, useEffect } from 'react';
import { RecipeStats, getCuisineLabel, Cuisine } from '../types/Recipe';
import { recipeService } from '../services/recipeService';

interface StatisticsProps {
  onClose: () => void;
}

export function Statistics({ onClose }: StatisticsProps) {
  const [stats, setStats] = useState<RecipeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="statistics">
        <div className="statistics-header">
          <h2>📊 Recipe Statistics</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics">
        <div className="statistics-header">
          <h2>📊 Recipe Statistics</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={loadStats}>Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="statistics">
        <div className="statistics-header">
          <h2>📊 Recipe Statistics</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <div className="empty">No statistics available</div>
      </div>
    );
  }

  const cuisineEntries = Object.entries(stats.cuisineBreakdown).sort(
    ([, a], [, b]) => b - a
  );
  const totalCuisineCount = cuisineEntries.reduce((sum, [, count]) => sum + count, 0);
  const cuisineColors = [
    '#2563eb',
    '#16a34a',
    '#ea580c',
    '#dc2626',
    '#9333ea',
    '#0f766e',
    '#e11d48',
    '#4f46e5',
    '#ca8a04',
    '#0ea5e9',
    '#6b7280'
  ];

  const renderCuisinePie = () => {
    if (totalCuisineCount === 0) {
      return (
        <div className="empty">No cuisine data available</div>
      );
    }

    let cumulative = 0;
    const size = 140;
    const center = size / 2;
    const radius = 52;
    const strokeWidth = 18;

    return (
      <div className="cuisine-pie">
        <svg viewBox={`0 0 ${size} ${size}`} className="pie-chart" role="img" aria-label="Cuisine breakdown">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {cuisineEntries.map(([cuisineKey, count], index) => {
            const value = count / totalCuisineCount;
            const circumference = 2 * Math.PI * radius;
            const dashArray = `${value * circumference} ${circumference}`;
            const dashOffset = -cumulative * circumference;
            cumulative += value;

            return (
              <circle
                key={cuisineKey}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={cuisineColors[index % cuisineColors.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${center} ${center})`}
              />
            );
          })}
          <circle cx={center} cy={center} r={radius - strokeWidth / 2} fill="#ffffff" />
        </svg>
        <div className="pie-legend">
          {cuisineEntries.map(([cuisineKey, count], index) => {
            const cuisineNum = Number.parseInt(cuisineKey, 10);
            const cuisineLabel = Number.isNaN(cuisineNum)
              ? cuisineKey
              : getCuisineLabel(cuisineNum as Cuisine);
            const percentage = totalCuisineCount > 0 ? (count / totalCuisineCount) * 100 : 0;
            return (
              <div key={cuisineKey} className="legend-item">
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: cuisineColors[index % cuisineColors.length] }}
                />
                <span className="legend-label">{cuisineLabel}</span>
                <span className="legend-value">{count}</span>
                <span className="legend-percent">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h2>📊 Recipe Statistics</h2>
        <button onClick={onClose} className="btn-close">×</button>
      </div>

      <div className="stats-grid">
        {/* Overview Cards */}
        <div className="stats-section overview">
          <h3>Overview</h3>
          <div className="stat-card">
            <span className="stat-label">Total Recipes</span>
            <span className="stat-value">{stats.totalRecipes}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Unique Cuisines</span>
            <span className="stat-value">{stats.uniqueCuisines}</span>
          </div>
        </div>

        {/* Average Times */}
        <div className="stats-section times">
          <h3>⏱️ Average Times (minutes)</h3>
          <div className="stat-card">
            <span className="stat-label">Preparation</span>
            <span className="stat-value">{stats.averagePreparationTime.toFixed(1)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Cooking</span>
            <span className="stat-value">{stats.averageCookingTime.toFixed(1)}</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.averageTotalTime.toFixed(1)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Servings</span>
            <span className="stat-value">{stats.averageServings.toFixed(1)}</span>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="stats-section difficulty">
          <h3>🌟 Difficulty Breakdown</h3>
          <div className="difficulty-breakdown">
            <div className="difficulty-item easy">
              <span className="difficulty-label">Easy</span>
              <span className="difficulty-count">{stats.difficultyBreakdown.easy}</span>
              <div className="difficulty-bar">
                <div
                  className="difficulty-fill easy"
                  style={{
                    width: `${stats.totalRecipes > 0 ? (stats.difficultyBreakdown.easy / stats.totalRecipes) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="difficulty-percent">
                {stats.totalRecipes > 0 ? ((stats.difficultyBreakdown.easy / stats.totalRecipes) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="difficulty-item medium">
              <span className="difficulty-label">Medium</span>
              <span className="difficulty-count">{stats.difficultyBreakdown.medium}</span>
              <div className="difficulty-bar">
                <div
                  className="difficulty-fill medium"
                  style={{
                    width: `${stats.totalRecipes > 0 ? (stats.difficultyBreakdown.medium / stats.totalRecipes) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="difficulty-percent">
                {stats.totalRecipes > 0 ? ((stats.difficultyBreakdown.medium / stats.totalRecipes) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="difficulty-item hard">
              <span className="difficulty-label">Hard</span>
              <span className="difficulty-count">{stats.difficultyBreakdown.hard}</span>
              <div className="difficulty-bar">
                <div
                  className="difficulty-fill hard"
                  style={{
                    width: `${stats.totalRecipes > 0 ? (stats.difficultyBreakdown.hard / stats.totalRecipes) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="difficulty-percent">
                {stats.totalRecipes > 0 ? ((stats.difficultyBreakdown.hard / stats.totalRecipes) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Cuisine Breakdown */}
        <div className="stats-section cuisines">
          <h3>🍽️ Cuisine Breakdown</h3>
          {renderCuisinePie()}
        </div>
      </div>
    </div>
  );
}
