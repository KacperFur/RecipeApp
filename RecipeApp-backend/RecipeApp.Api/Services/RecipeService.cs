using Microsoft.Extensions.Logging;
using RecipeApp.Api.Models;
using RecipeApp.Api.Repositories;

namespace RecipeApp.Api.Services;

/// <summary>
/// Service for managing recipe business logic.
/// </summary>
/// <param name="recipeRepository">The recipe repository for data access.</param>
/// <param name="logger">The logger for logging service operations.</param>
public class RecipeService(IRecipeRepository recipeRepository, ILogger<RecipeService> logger) : IRecipeService
{
    /// <summary>
    /// Gets recipes using filtering, sorting, and pagination asynchronously.
    /// </summary>
    public async Task<PagedResult<Recipe>> GetRecipesAsync(
        string? searchTerm,
        DifficultyLevel? difficulty,
        int? maxCookingTime,
        RecipeSortBy? sortBy,
        SortDirection? sortDirection,
        int pageNumber,
        int pageSize)
    {
        logger.LogInformation(
            "Retrieving recipes with criteria - SearchTerm: {SearchTerm}, Difficulty: {Difficulty}, MaxCookingTime: {MaxCookingTime}, SortBy: {SortBy}, SortDirection: {SortDirection}, PageNumber: {PageNumber}, PageSize: {PageSize}",
            searchTerm ?? "(none)",
            difficulty?.ToString() ?? "(none)",
            maxCookingTime?.ToString() ?? "(none)",
            sortBy?.ToString() ?? "(none)",
            sortDirection?.ToString() ?? "(none)",
            pageNumber,
            pageSize);

        var recipes = await recipeRepository.GetPagedAsync(
            searchTerm,
            difficulty,
            maxCookingTime,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize).ConfigureAwait(false);

        logger.LogInformation("Recipe query completed. Total results {TotalCount}", recipes.TotalCount);
        return recipes;
    }

    /// <summary>
    /// Gets a recipe by its identifier asynchronously.
    /// </summary>
    public async Task<Recipe> GetRecipeByIdAsync(int id)
    {
        logger.LogInformation("Retrieving recipe with id {RecipeId}", id);
        var recipe = await recipeRepository.GetByIdAsync(id).ConfigureAwait(false);

        if (recipe is null)
        {
            logger.LogWarning("Recipe with id {RecipeId} not found", id);
            throw new InvalidOperationException($"Recipe with id {id} not found.");
        }

        logger.LogInformation("Successfully retrieved recipe with id {RecipeId}", id);
        return recipe;
    }

    /// <summary>
    /// Creates a new recipe asynchronously.
    /// </summary>
    public async Task<Recipe> CreateRecipeAsync(CreateRecipeRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        logger.LogInformation("Creating new recipe: {RecipeName}", request.Name);

        var recipe = new Recipe
        {
            Name = request.Name,
            Description = request.Description,
            CookingTimeMinutes = request.CookingTimeMinutes,
            PreparationTimeMinutes = request.PreparationTimeMinutes,
            Servings = request.Servings,
            Difficulty = request.Difficulty,
            Cuisine = request.Cuisine,
            Instructions = request.Instructions,
            Ingredients = request.Ingredients.Select(i => new Ingredient
            {
                Name = i.Name,
                Quantity = i.Quantity,
                Unit = i.Unit
            }).ToList()
        };

        var createdRecipe = await recipeRepository.CreateAsync(recipe).ConfigureAwait(false);
        logger.LogInformation("Recipe created successfully with id {RecipeId}", createdRecipe.Id);
        return createdRecipe;
    }

    /// <summary>
    /// Updates an existing recipe asynchronously.
    /// </summary>
    public async Task<Recipe> UpdateRecipeAsync(int id, CreateRecipeRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        logger.LogInformation("Updating recipe with id {RecipeId}", id);

        var existingRecipe = await GetRecipeByIdAsync(id).ConfigureAwait(false);

        existingRecipe.Name = request.Name;
        existingRecipe.Description = request.Description;
        existingRecipe.CookingTimeMinutes = request.CookingTimeMinutes;
        existingRecipe.PreparationTimeMinutes = request.PreparationTimeMinutes;
        existingRecipe.Servings = request.Servings;
        existingRecipe.Difficulty = request.Difficulty;
        existingRecipe.Cuisine = request.Cuisine;
        existingRecipe.Instructions = request.Instructions;
        existingRecipe.Ingredients = request.Ingredients.Select(i => new Ingredient
        {
            Name = i.Name,
            Quantity = i.Quantity,
            Unit = i.Unit
        }).ToList();

        await recipeRepository.UpdateAsync(existingRecipe).ConfigureAwait(false);
        logger.LogInformation("Recipe with id {RecipeId} updated successfully", id);
        return existingRecipe;
    }

    /// <summary>
    /// Deletes a recipe by its identifier asynchronously.
    /// </summary>
    public async Task DeleteRecipeAsync(int id)
    {
        logger.LogInformation("Deleting recipe with id {RecipeId}", id);
        await GetRecipeByIdAsync(id).ConfigureAwait(false);
        await recipeRepository.DeleteAsync(id).ConfigureAwait(false);
        logger.LogInformation("Recipe with id {RecipeId} deleted successfully", id);
    }

    /// <summary>
    /// Gets aggregated statistics about all recipes asynchronously.
    /// </summary>
    public async Task<RecipeStats> GetStatsAsync()
    {
        logger.LogInformation("Retrieving recipe statistics");
        var stats = await recipeRepository.GetStatsAsync().ConfigureAwait(false);
        logger.LogInformation(
            "Statistics retrieved - Total: {TotalRecipes}, UniqueCuisines: {UniqueCuisines}, AvgPrep: {AvgPrepTime}min, AvgCook: {AvgCookTime}min",
            stats.TotalRecipes,
            stats.UniqueCuisines,
            stats.AveragePreparationTime,
            stats.AverageCookingTime);
        return stats;
    }
}
