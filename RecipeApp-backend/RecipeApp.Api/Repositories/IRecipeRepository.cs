using RecipeApp.Api.Models;

namespace RecipeApp.Api.Repositories;

/// <summary>
/// Interface for recipe data repository operations.
/// </summary>
public interface IRecipeRepository
{
    /// <summary>
    /// Gets all recipes asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation containing a collection of recipes.</returns>
    Task<IEnumerable<Recipe>> GetAllAsync();

    /// <summary>
    /// Gets recipes using filtering, sorting, and pagination asynchronously.
    /// </summary>
    /// <param name="searchTerm">The term to search for in recipe name and description.</param>
    /// <param name="difficulty">Optional difficulty level to filter by.</param>
    /// <param name="maxCookingTime">Optional maximum cooking time in minutes.</param>
    /// <param name="sortBy">Optional field to sort by.</param>
    /// <param name="sortDirection">Optional sorting direction.</param>
    /// <param name="pageNumber">The page number to retrieve.</param>
    /// <param name="pageSize">The number of items per page.</param>
    /// <returns>A task that represents the asynchronous operation containing a paged result of recipes.</returns>
    Task<PagedResult<Recipe>> GetPagedAsync(
        string? searchTerm,
        DifficultyLevel? difficulty,
        int? maxCookingTime,
        RecipeSortBy? sortBy,
        SortDirection? sortDirection,
        int pageNumber,
        int pageSize);

    /// <summary>
    /// Gets a recipe by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The recipe identifier.</param>
    /// <returns>A task that represents the asynchronous operation containing the recipe, or null if not found.</returns>
    Task<Recipe?> GetByIdAsync(int id);

    /// <summary>
    /// Creates a new recipe asynchronously.
    /// </summary>
    /// <param name="recipe">The recipe to create.</param>
    /// <returns>A task that represents the asynchronous operation containing the created recipe.</returns>
    Task<Recipe> CreateAsync(Recipe recipe);

    /// <summary>
    /// Updates an existing recipe asynchronously.
    /// </summary>
    /// <param name="recipe">The recipe to update.</param>
    /// <returns>A task that represents the asynchronous operation indicating success.</returns>
    Task UpdateAsync(Recipe recipe);

    /// <summary>
    /// Deletes a recipe by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The recipe identifier.</param>
    /// <returns>A task that represents the asynchronous operation indicating success.</returns>
    Task DeleteAsync(int id);

    /// <summary>
    /// Gets aggregated statistics about all recipes asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation containing recipe statistics.</returns>
    Task<RecipeStats> GetStatsAsync();
}
