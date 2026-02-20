using RecipeApp.Api.Models;

namespace RecipeApp.Api.Repositories;

/// <summary>
/// In-memory implementation of the recipe repository.
/// </summary>
public class InMemoryRecipeRepository : IRecipeRepository
{
    private readonly List<Recipe> _recipes = [];
    private int _nextId = 1;

    public InMemoryRecipeRepository()
    {
        SeedRecipes();
    }

    private void SeedRecipes()
    {
        AddSeedRecipe(new Recipe
        {
            Name = "Margherita Pizza",
            Description = "Classic pizza with tomato, mozzarella, and basil.",
            PreparationTimeMinutes = 15,
            CookingTimeMinutes = 12,
            Servings = 2,
            Difficulty = DifficultyLevel.Easy,
            Cuisine = Cuisine.Italian,
            Instructions = "Stretch dough, add sauce and cheese, bake until golden, finish with basil.",
            Ingredients =
            [
                new Ingredient { Name = "Pizza dough", Quantity = 1, Unit = "ball" },
                new Ingredient { Name = "Tomato sauce", Quantity = 0.5m, Unit = "cup" },
                new Ingredient { Name = "Mozzarella", Quantity = 150, Unit = "g" },
                new Ingredient { Name = "Basil", Quantity = 6, Unit = "leaves" }
            ]
        });

        AddSeedRecipe(new Recipe
        {
            Name = "Chicken Tikka Masala",
            Description = "Creamy tomato curry with spiced chicken.",
            PreparationTimeMinutes = 20,
            CookingTimeMinutes = 30,
            Servings = 4,
            Difficulty = DifficultyLevel.Medium,
            Cuisine = Cuisine.Indian,
            Instructions = "Marinate chicken, sear, simmer in spiced tomato cream sauce.",
            Ingredients =
            [
                new Ingredient { Name = "Chicken breast", Quantity = 500, Unit = "g" },
                new Ingredient { Name = "Yogurt", Quantity = 0.5m, Unit = "cup" },
                new Ingredient { Name = "Tomato puree", Quantity = 1, Unit = "cup" },
                new Ingredient { Name = "Garlic", Quantity = 3, Unit = "cloves" },
                new Ingredient { Name = "Garam masala", Quantity = 2, Unit = "tsp" }
            ]
        });

        AddSeedRecipe(new Recipe
        {
            Name = "Veggie Stir Fry",
            Description = "Quick stir fry with mixed vegetables and soy sauce.",
            PreparationTimeMinutes = 10,
            CookingTimeMinutes = 8,
            Servings = 2,
            Difficulty = DifficultyLevel.Easy,
            Cuisine = Cuisine.Asian,
            Instructions = "Stir fry vegetables, add sauce, cook until crisp-tender.",
            Ingredients =
            [
                new Ingredient { Name = "Broccoli", Quantity = 1, Unit = "cup" },
                new Ingredient { Name = "Bell pepper", Quantity = 1, Unit = "piece" },
                new Ingredient { Name = "Carrot", Quantity = 1, Unit = "piece" },
                new Ingredient { Name = "Soy sauce", Quantity = 2, Unit = "tbsp" },
                new Ingredient { Name = "Sesame oil", Quantity = 1, Unit = "tbsp" }
            ]
        });

        AddSeedRecipe(new Recipe
        {
            Name = "Beef Tacos",
            Description = "Seasoned beef tacos with fresh toppings.",
            PreparationTimeMinutes = 15,
            CookingTimeMinutes = 15,
            Servings = 4,
            Difficulty = DifficultyLevel.Medium,
            Cuisine = Cuisine.Mexican,
            Instructions = "Cook beef with spices, warm tortillas, assemble with toppings.",
            Ingredients =
            [
                new Ingredient { Name = "Ground beef", Quantity = 500, Unit = "g" },
                new Ingredient { Name = "Tortillas", Quantity = 8, Unit = "pieces" },
                new Ingredient { Name = "Onion", Quantity = 0.5m, Unit = "piece" },
                new Ingredient { Name = "Tomato", Quantity = 1, Unit = "piece" },
                new Ingredient { Name = "Taco seasoning", Quantity = 2, Unit = "tbsp" }
            ]
        });
    }

    private void AddSeedRecipe(Recipe recipe)
    {
        recipe.Id = _nextId++;
        recipe.CreatedAt = DateTime.UtcNow.AddDays(-_nextId);
        recipe.UpdatedAt = recipe.CreatedAt;

        foreach (var ingredient in recipe.Ingredients)
        {
            ingredient.RecipeId = recipe.Id;
        }

        _recipes.Add(recipe);
    }

    /// <summary>
    /// Gets all recipes asynchronously.
    /// </summary>
    public Task<IEnumerable<Recipe>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<Recipe>>(_recipes.AsReadOnly());
    }

    /// <summary>
    /// Gets recipes using filtering, sorting, and pagination asynchronously.
    /// </summary>
    public Task<PagedResult<Recipe>> GetPagedAsync(
        string? searchTerm,
        DifficultyLevel? difficulty,
        int? maxCookingTime,
        RecipeSortBy? sortBy,
        SortDirection? sortDirection,
        int pageNumber,
        int pageSize)
    {
        var query = _recipes.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLowerInvariant();
            query = query.Where(r =>
                r.Name.ToLowerInvariant().Contains(lowerSearchTerm) ||
                (r.Description != null && r.Description.ToLowerInvariant().Contains(lowerSearchTerm)));
        }

        if (difficulty.HasValue)
        {
            query = query.Where(r => r.Difficulty == difficulty.Value);
        }

        if (maxCookingTime.HasValue)
        {
            query = query.Where(r => r.CookingTimeMinutes <= maxCookingTime.Value);
        }

        query = ApplySorting(query, sortBy, sortDirection);

        var totalCount = query.Count();
        var items = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var result = new PagedResult<Recipe>(items, totalCount, pageNumber, pageSize);
        return Task.FromResult(result);
    }

    private static IEnumerable<Recipe> ApplySorting(
        IEnumerable<Recipe> query,
        RecipeSortBy? sortBy,
        SortDirection? sortDirection)
    {
        var direction = sortDirection ?? SortDirection.Asc;

        return sortBy switch
        {
            RecipeSortBy.PreparationTime => direction == SortDirection.Asc
                ? query.OrderBy(r => r.PreparationTimeMinutes).ThenBy(r => r.Id)
                : query.OrderByDescending(r => r.PreparationTimeMinutes).ThenByDescending(r => r.Id),
            RecipeSortBy.Difficulty => direction == SortDirection.Asc
                ? query.OrderBy(r => r.Difficulty).ThenBy(r => r.Id)
                : query.OrderByDescending(r => r.Difficulty).ThenByDescending(r => r.Id),
            _ => query.OrderBy(r => r.Id)
        };
    }

    /// <summary>
    /// Gets a recipe by its identifier asynchronously.
    /// </summary>
    public Task<Recipe?> GetByIdAsync(int id)
    {
        var recipe = _recipes.FirstOrDefault(r => r.Id == id);
        return Task.FromResult(recipe);
    }

    /// <summary>
    /// Creates a new recipe asynchronously.
    /// </summary>
    public Task<Recipe> CreateAsync(Recipe recipe)
    {
        ArgumentNullException.ThrowIfNull(recipe);

        recipe.Id = _nextId++;
        recipe.CreatedAt = DateTime.UtcNow;
        recipe.UpdatedAt = DateTime.UtcNow;

        _recipes.Add(recipe);

        return Task.FromResult(recipe);
    }

    /// <summary>
    /// Updates an existing recipe asynchronously.
    /// </summary>
    public Task UpdateAsync(Recipe recipe)
    {
        ArgumentNullException.ThrowIfNull(recipe);

        var existingRecipe = _recipes.FirstOrDefault(r => r.Id == recipe.Id);
        if (existingRecipe is null)
        {
            throw new InvalidOperationException($"Recipe with id {recipe.Id} not found.");
        }

        existingRecipe.Name = recipe.Name;
        existingRecipe.Description = recipe.Description;
        existingRecipe.CookingTimeMinutes = recipe.CookingTimeMinutes;
        existingRecipe.PreparationTimeMinutes = recipe.PreparationTimeMinutes;
        existingRecipe.Servings = recipe.Servings;
        existingRecipe.Difficulty = recipe.Difficulty;
        existingRecipe.Instructions = recipe.Instructions;
        existingRecipe.Ingredients = recipe.Ingredients;
        existingRecipe.UpdatedAt = DateTime.UtcNow;

        return Task.CompletedTask;
    }

    /// <summary>
    /// Deletes a recipe by its identifier asynchronously.
    /// </summary>
    public Task DeleteAsync(int id)
    {
        var recipe = _recipes.FirstOrDefault(r => r.Id == id);
        if (recipe is null)
        {
            throw new InvalidOperationException($"Recipe with id {id} not found.");
        }

        _recipes.Remove(recipe);
        return Task.CompletedTask;
    }

    /// <summary>
    /// Gets aggregated statistics about all recipes asynchronously.
    /// </summary>
    public Task<RecipeStats> GetStatsAsync()
    {
        if (_recipes.Count == 0)
        {
            return Task.FromResult(new RecipeStats());
        }

        var stats = new RecipeStats
        {
            TotalRecipes = _recipes.Count,
            UniqueCuisines = _recipes.Select(r => r.Cuisine).Distinct().Count(),
            AveragePreparationTime = (decimal)_recipes.Average(r => r.PreparationTimeMinutes),
            AverageCookingTime = (decimal)_recipes.Average(r => r.CookingTimeMinutes),
            AverageTotalTime = (decimal)_recipes.Average(r => r.PreparationTimeMinutes + r.CookingTimeMinutes),
            AverageServings = (decimal)_recipes.Average(r => r.Servings),
            DifficultyBreakdown = new RecipeStats.DifficultyStats
            {
                Easy = _recipes.Count(r => r.Difficulty == DifficultyLevel.Easy),
                Medium = _recipes.Count(r => r.Difficulty == DifficultyLevel.Medium),
                Hard = _recipes.Count(r => r.Difficulty == DifficultyLevel.Hard)
            },
            CuisineBreakdown = _recipes
                .GroupBy(r => r.Cuisine)
                .ToDictionary(g => g.Key, g => g.Count())
        };

        return Task.FromResult(stats);
    }
}
