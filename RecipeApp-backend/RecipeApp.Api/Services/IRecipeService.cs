using RecipeApp.Api.Models;

namespace RecipeApp.Api.Services;

/// <summary>
/// Interface for recipe business logic operations.
/// </summary>
public interface IRecipeService
{
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
    Task<PagedResult<Recipe>> GetRecipesAsync(
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
    /// <returns>A task that represents the asynchronous operation containing the recipe.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the recipe is not found.</exception>
    Task<Recipe> GetRecipeByIdAsync(int id);

    /// <summary>
    /// Creates a new recipe asynchronously.
    /// </summary>
    /// <param name="request">The recipe creation request.</param>
    /// <returns>A task that represents the asynchronous operation containing the created recipe.</returns>
    Task<Recipe> CreateRecipeAsync(CreateRecipeRequest request);

    /// <summary>
    /// Updates an existing recipe asynchronously.
    /// </summary>
    /// <param name="id">The recipe identifier.</param>
    /// <param name="request">The recipe update request.</param>
    /// <returns>A task that represents the asynchronous operation containing the updated recipe.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the recipe is not found.</exception>
    Task<Recipe> UpdateRecipeAsync(int id, CreateRecipeRequest request);

    /// <summary>
    /// Deletes a recipe by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The recipe identifier.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the recipe is not found.</exception>
    Task DeleteRecipeAsync(int id);

    /// <summary>
    /// Gets aggregated statistics about all recipes asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation containing recipe statistics.</returns>
    Task<RecipeStats> GetStatsAsync();
}
