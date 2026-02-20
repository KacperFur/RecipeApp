import { Recipe, getCuisineLabel } from '../types/Recipe';

interface RecipeDetailsProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
}

export function RecipeDetails({ recipe, onClose, onEdit }: RecipeDetailsProps) {
  const getDifficultyLabel = (difficulty: number): string => {
    switch (difficulty) {
      case 0: return 'Easy';
      case 1: return 'Medium';
      case 2: return 'Hard';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const totalTime = recipe.preparationTimeMinutes + recipe.cookingTimeMinutes;

  return (
    <div className="recipe-details">
      <div className="details-header">
        <div>
          <h2>{recipe.name}</h2>
          <span className={`difficulty difficulty-${getDifficultyLabel(recipe.difficulty).toLowerCase()}`}>
            {getDifficultyLabel(recipe.difficulty)}
          </span>
        </div>
        <div className="details-actions">
          <button onClick={() => onEdit(recipe)} className="btn-edit">
            Edit Recipe
          </button>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>

      {recipe.description && (
        <div className="details-section">
          <h3>Description</h3>
          <p>{recipe.description}</p>
        </div>
      )}

      <div className="details-section">
        <h3>Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Cuisine:</span>
            <span className="info-value">{getCuisineLabel(recipe.cuisine)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Preparation Time:</span>
            <span className="info-value">{recipe.preparationTimeMinutes} minutes</span>
          </div>
          <div className="info-item">
            <span className="info-label">Cooking Time:</span>
            <span className="info-value">{recipe.cookingTimeMinutes} minutes</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Time:</span>
            <span className="info-value">{totalTime} minutes</span>
          </div>
          <div className="info-item">
            <span className="info-label">Servings:</span>
            <span className="info-value">{recipe.servings}</span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h3>Ingredients ({recipe.ingredients.length})</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              <span className="ingredient-quantity">{ingredient.quantity}</span>
              <span className="ingredient-unit">{ingredient.unit}</span>
              <span className="ingredient-name">{ingredient.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {recipe.instructions && (
        <div className="details-section">
          <h3>Instructions</h3>
          <div className="instructions">{recipe.instructions}</div>
        </div>
      )}

      <div className="details-section">
        <div className="timestamps">
          <p>Created: {formatDate(recipe.createdAt)}</p>
          <p>Last Updated: {formatDate(recipe.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
