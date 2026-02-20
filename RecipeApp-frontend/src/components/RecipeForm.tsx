import { useState, useEffect } from 'react';
import { Recipe, CreateRecipeRequest, CreateIngredientRequest, DifficultyLevel, Cuisine, getCuisineLabel } from '../types/Recipe';
import { recipeService } from '../services/recipeService';

interface RecipeFormProps {
  recipe?: Recipe;
  onSave: () => void;
  onCancel: () => void;
}

export function RecipeForm({ recipe, onSave, onCancel }: RecipeFormProps) {
  const [formData, setFormData] = useState<CreateRecipeRequest>({
    name: '',
    description: '',
    cookingTimeMinutes: 0,
    preparationTimeMinutes: 0,
    servings: 1,
    difficulty: DifficultyLevel.Easy,
    cuisine: Cuisine.Italian,
    ingredients: [],
    instructions: '',
  });

  const [newIngredient, setNewIngredient] = useState<CreateIngredientRequest>({
    name: '',
    quantity: 0,
    unit: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        description: recipe.description || '',
        cookingTimeMinutes: recipe.cookingTimeMinutes,
        preparationTimeMinutes: recipe.preparationTimeMinutes,
        servings: recipe.servings,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
        instructions: recipe.instructions || '',
      });
    }
  }, [recipe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Recipe name is required');
      return;
    }

    if (formData.ingredients.length === 0) {
      setError('At least one ingredient is required');
      return;
    }

    try {
      setSaving(true);
      if (recipe) {
        await recipeService.updateRecipe(recipe.id, formData);
      } else {
        await recipeService.createRecipe(formData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim() || !newIngredient.unit.trim() || newIngredient.quantity <= 0) {
      alert('Please fill in all ingredient fields');
      return;
    }

    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ...newIngredient }],
    });

    setNewIngredient({ name: '', quantity: 0, unit: '' });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="recipe-form">
      <h2>{recipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Recipe Name *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prepTime">Preparation Time (minutes) *</label>
            <input
              id="prepTime"
              type="number"
              min="0"
              value={formData.preparationTimeMinutes}
              onChange={(e) => setFormData({ ...formData, preparationTimeMinutes: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cookTime">Cooking Time (minutes) *</label>
            <input
              id="cookTime"
              type="number"
              min="0"
              value={formData.cookingTimeMinutes}
              onChange={(e) => setFormData({ ...formData, cookingTimeMinutes: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="servings">Servings *</label>
            <input
              id="servings"
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty *</label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) as DifficultyLevel })}
              required
            >
              <option value={DifficultyLevel.Easy}>Easy</option>
              <option value={DifficultyLevel.Medium}>Medium</option>
              <option value={DifficultyLevel.Hard}>Hard</option>
            </select>

          <div className="form-group">
            <label htmlFor="cuisine">Cuisine *</label>
            <select
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: parseInt(e.target.value) as Cuisine })}
              required
            >
              {Object.values(Cuisine).filter(v => typeof v === 'number').map((cuisineValue) => (
                <option key={cuisineValue} value={cuisineValue as number}>
                  {getCuisineLabel(cuisineValue as Cuisine)}
                </option>
              ))}
            </select>
          </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Ingredients</h3>
          
          {formData.ingredients.length > 0 && (
            <ul className="ingredients-form-list">
              {formData.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span>{ingredient.quantity} {ingredient.unit} {ingredient.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="ingredient-input">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Quantity"
                  min="0"
                  step="0.01"
                  value={newIngredient.quantity || ''}
                  onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Unit (cups, tsp, etc.)"
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                />
              </div>
              <button type="button" onClick={handleAddIngredient} className="btn-add">
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            rows={8}
            placeholder="Enter cooking instructions..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : (recipe ? 'Update Recipe' : 'Create Recipe')}
          </button>
          <button type="button" onClick={onCancel} disabled={saving} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
