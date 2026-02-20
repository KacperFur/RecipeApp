import {
  Recipe,
  CreateRecipeRequest,
  DifficultyLevel,
  RecipeSortBy,
  SortDirection,
  PagedResult,
  RecipeStats
} from '../types/Recipe';

const API_BASE_URL = '/api/recipes';

export interface SearchFilters {
  searchTerm?: string;
  difficulty?: DifficultyLevel;
  maxCookingTime?: number;
  sortBy?: RecipeSortBy;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
}

export const recipeService = {
  // Get all recipes or search with filters
  async getAllRecipes(filters?: SearchFilters): Promise<PagedResult<Recipe>> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) {
      params.append('searchTerm', filters.searchTerm);
    }
    if (filters?.difficulty !== undefined) {
      params.append('difficulty', filters.difficulty.toString());
    }
    if (filters?.maxCookingTime !== undefined) {
      params.append('maxCookingTime', filters.maxCookingTime.toString());
    }
    if (filters?.sortBy !== undefined) {
      params.append('sortBy', filters.sortBy.toString());
    }
    if (filters?.sortDirection !== undefined) {
      params.append('sortDirection', filters.sortDirection.toString());
    }
    if (filters?.pageNumber !== undefined) {
      params.append('pageNumber', filters.pageNumber.toString());
    }
    if (filters?.pageSize !== undefined) {
      params.append('pageSize', filters.pageSize.toString());
    }
    
    const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  },
  
  // Search recipes with filters
  async searchRecipes(filters: SearchFilters): Promise<PagedResult<Recipe>> {
    return this.getAllRecipes(filters);
  },

  // Get recipe statistics
  async getStats(): Promise<RecipeStats> {
    const response = await fetch(`${API_BASE_URL}/statistics/summary`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe statistics');
    }
    return response.json();
  },

  // Get a single recipe by ID
  async getRecipeById(id: number): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Recipe not found');
      }
      throw new Error('Failed to fetch recipe');
    }
    return response.json();
  },

  // Create a new recipe
  async createRecipe(recipe: CreateRecipeRequest): Promise<Recipe> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create recipe');
    }
    return response.json();
  },

  // Update an existing recipe
  async updateRecipe(id: number, recipe: CreateRecipeRequest): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Recipe not found');
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update recipe');
    }
    return response.json();
  },

  // Delete a recipe
  async deleteRecipe(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Recipe not found');
      }
      throw new Error('Failed to delete recipe');
    }
  },
};
