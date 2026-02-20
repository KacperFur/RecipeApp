import { useState, useEffect } from 'react';
import { Recipe, DifficultyLevel, RecipeSortBy, SortDirection, getCuisineLabel } from '../types/Recipe';
import { recipeService, SearchFilters } from '../services/recipeService';

interface RecipeListProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  refreshTrigger: number;
}

export function RecipeList({ onSelectRecipe, onEditRecipe, refreshTrigger }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | ''>('');
  const [maxCookingTime, setMaxCookingTime] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<RecipeSortBy | ''>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Asc);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>({});

  useEffect(() => {
    loadRecipes();
  }, [
    refreshTrigger,
    appliedFilters.searchTerm,
    appliedFilters.difficulty,
    appliedFilters.maxCookingTime,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize
  ]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: SearchFilters = {
        searchTerm: appliedFilters.searchTerm,
        difficulty: appliedFilters.difficulty,
        maxCookingTime: appliedFilters.maxCookingTime,
        sortBy: sortBy === '' ? undefined : sortBy,
        sortDirection: sortBy === '' ? undefined : sortDirection,
        pageNumber,
        pageSize
      };

      const data = await recipeService.getAllRecipes(filters);
      setRecipes(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setPageNumber(data.pageNumber);
      setPageSize(data.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value === '' ? '' : (Number(value) as DifficultyLevel));
  };
  
  const handleCookingTimeChange = (value: string) => {
    setMaxCookingTime(value === '' ? '' : Number(value));
  };
  
  const handleApplyFilters = () => {
    const nextFilters: SearchFilters = {};
    if (searchTerm.trim()) {
      nextFilters.searchTerm = searchTerm.trim();
    }
    if (selectedDifficulty !== '' && selectedDifficulty !== undefined) {
      nextFilters.difficulty = selectedDifficulty as DifficultyLevel;
    }
    if (maxCookingTime !== '' && maxCookingTime) {
      nextFilters.maxCookingTime = Number(maxCookingTime);
    }

    setPageNumber(1);
    setAppliedFilters(nextFilters);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('');
    setMaxCookingTime('');
    setSortBy('');
    setSortDirection(SortDirection.Asc);
    setPageNumber(1);
    setAppliedFilters({});
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value === '' ? '' : (Number(value) as RecipeSortBy));
    setPageNumber(1);
  };

  const handleSortDirectionChange = (value: string) => {
    setSortDirection(Number(value) as SortDirection);
    setPageNumber(1);
  };

  const handlePageSizeChange = (value: string) => {
    const nextSize = Number(value);
    setPageSize(nextSize);
    setPageNumber(1);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id);
      await loadRecipes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  const getDifficultyLabel = (difficulty: number): string => {
    switch (difficulty) {
      case 0: return 'Easy';
      case 1: return 'Medium';
      case 2: return 'Hard';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={loadRecipes}>Retry</button>
      </div>
    );
  }

  const hasActiveFilters =
    searchTerm ||
    selectedDifficulty !== '' ||
    maxCookingTime !== '' ||
    sortBy !== '';

  return (
    <div className="recipe-list">
      <h2>All Recipes ({totalCount})</h2>
      
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="filter-input"
            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
          />
          
          <select
            value={selectedDifficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Difficulties</option>
            <option value="0">Easy</option>
            <option value="1">Medium</option>
            <option value="2">Hard</option>
          </select>
          
          <input
            type="number"
            placeholder="Max cooking time (min)"
            value={maxCookingTime}
            onChange={(e) => handleCookingTimeChange(e.target.value)}
            className="filter-input"
            min="0"
            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
          />
          
          <button onClick={handleApplyFilters} className="btn-search">
            Search
          </button>
          
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="btn-clear">
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {recipes.length === 0 && !loading && (
        <div className="empty">No recipes found. {hasActiveFilters ? 'Try adjusting your filters.' : 'Create your first recipe!'}</div>
      )}

      <div className="sort-pagination-bar">
        <div className="sort-controls">
          <label>
            Sort by
            <select
              value={sortBy}
              onChange={(e) => handleSortByChange(e.target.value)}
              className="filter-select"
            >
              <option value="">None</option>
              <option value="0">Preparation Time</option>
              <option value="1">Difficulty</option>
            </select>
          </label>
          <label>
            Direction
            <select
              value={sortDirection}
              onChange={(e) => handleSortDirectionChange(e.target.value)}
              className="filter-select"
              disabled={sortBy === ''}
            >
              <option value="0">Ascending</option>
              <option value="1">Descending</option>
            </select>
          </label>
        </div>

        <div className="pagination-controls">
          <label>
            Page size
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="filter-select"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
          <div className="page-buttons">
            <button
              className="btn-page"
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
            >
              Prev
            </button>
            <span className="page-info">Page {pageNumber} of {Math.max(totalPages, 1)}</span>
            <button
              className="btn-page"
              onClick={() => setPageNumber((prev) => Math.min(totalPages || 1, prev + 1))}
              disabled={totalPages === 0 || pageNumber >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {recipes.length > 0 && (
        <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-card-header">
              <h3>{recipe.name}</h3>
              <span className={`difficulty difficulty-${getDifficultyLabel(recipe.difficulty).toLowerCase()}`}>
                {getDifficultyLabel(recipe.difficulty)}
              </span>
            </div>
            
            {recipe.description && (
              <p className="recipe-description">{recipe.description}</p>
            )}
            
            <div className="recipe-meta">
              <div className="meta-item">
                <span className="meta-label">Cuisine:</span>
                <span className="meta-value">{getCuisineLabel(recipe.cuisine)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Prep:</span>
                <span className="meta-value">{recipe.preparationTimeMinutes} min</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cook:</span>
                <span className="meta-value">{recipe.cookingTimeMinutes} min</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Servings:</span>
                <span className="meta-value">{recipe.servings}</span>
              </div>
            </div>

            <div className="recipe-ingredients-count">
              {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
            </div>

            <div className="recipe-actions">
              <button onClick={() => onSelectRecipe(recipe)} className="btn-view">
                View Details
              </button>
              <button onClick={() => onEditRecipe(recipe)} className="btn-edit">
                Edit
              </button>
              <button 
                onClick={() => handleDelete(recipe.id, recipe.name)} 
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
