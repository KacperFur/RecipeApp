export enum DifficultyLevel {
  Easy = 0,
  Medium = 1,
  Hard = 2
}

export enum Cuisine {
  Italian = 0,
  French = 1,
  Mexican = 2,
  Asian = 3,
  Indian = 4,
  Mediterranean = 5,
  American = 6,
  Spanish = 7,
  Thai = 8,
  Japanese = 9,
  Other = 10
}

export function getCuisineLabel(cuisine: Cuisine | number | string): string {
  // Handle string inputs - could be numeric strings or cuisine names
  if (typeof cuisine === 'string') {
    // Try parsing as number first
    const numValue = parseInt(cuisine, 10);
    if (!isNaN(numValue)) {
      return getCuisineLabel(numValue);
    }
    
    // Try as cuisine name
    switch (cuisine) {
      case 'Italian':
        return 'Italian';
      case 'French':
        return 'French';
      case 'Mexican':
        return 'Mexican';
      case 'Asian':
        return 'Asian';
      case 'Indian':
        return 'Indian';
      case 'Mediterranean':
        return 'Mediterranean';
      case 'American':
        return 'American';
      case 'Spanish':
        return 'Spanish';
      case 'Thai':
        return 'Thai';
      case 'Japanese':
        return 'Japanese';
      case 'Other':
        return 'Other';
      default:
        return 'Unknown';
    }
  }
  
  // Handle numeric inputs
  const cuisineNum = Number(cuisine);
  
  switch (cuisineNum) {
    case 0:
      return 'Italian';
    case 1:
      return 'French';
    case 2:
      return 'Mexican';
    case 3:
      return 'Asian';
    case 4:
      return 'Indian';
    case 5:
      return 'Mediterranean';
    case 6:
      return 'American';
    case 7:
      return 'Spanish';
    case 8:
      return 'Thai';
    case 9:
      return 'Japanese';
    case 10:
      return 'Other';
    default:
      return 'Unknown';
  }
}

export enum RecipeSortBy {
  PreparationTime = 0,
  Difficulty = 1
}

export enum SortDirection {
  Asc = 0,
  Desc = 1
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
}

export interface RecipeStats {
  totalRecipes: number;
  uniqueCuisines: number;
  averagePreparationTime: number;
  averageCookingTime: number;
  averageTotalTime: number;
  averageServings: number;
  difficultyBreakdown: DifficultyStats;
  cuisineBreakdown: Record<string, number>;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  recipeId: number;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  cookingTimeMinutes: number;
  preparationTimeMinutes: number;
  servings: number;
  difficulty: DifficultyLevel;
  cuisine: Cuisine;
  ingredients: Ingredient[];
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientRequest {
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateRecipeRequest {
  name: string;
  description?: string;
  cookingTimeMinutes: number;
  preparationTimeMinutes: number;
  servings: number;
  difficulty: DifficultyLevel;
  cuisine: Cuisine;
  ingredients: CreateIngredientRequest[];
  instructions?: string;
}
