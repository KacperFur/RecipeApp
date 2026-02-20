using RecipeApp.Api.Models;
using RecipeApp.Api.Services;

namespace RecipeApp.Api.Endpoints;

/// <summary>
/// Extension methods for registering recipe endpoints.
/// </summary>
public static class RecipeEndpoints
{
    /// <summary>
    /// Maps recipe-related endpoints to the application.
    /// </summary>
    /// <param name="app">The web application builder.</param>
    /// <returns>The web application builder for chaining.</returns>
    public static WebApplication MapRecipeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/recipes")
            .WithTags("Recipes");

        group.MapGet("/", GetAllRecipes)
            .WithName("GetAllRecipes")
            .WithSummary("Get recipes with search, sorting, and pagination")
            .WithDescription("Retrieves recipes filtered by search criteria with optional sorting and pagination")
            .Produces<PagedResult<Recipe>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapGet("/{id}", GetRecipeById)
            .WithName("GetRecipeById")
            .WithSummary("Get recipe by ID")
            .WithDescription("Retrieves a specific recipe by its identifier")
            .Produces<Recipe>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/", CreateRecipe)
            .WithName("CreateRecipe")
            .WithSummary("Create a new recipe")
            .WithDescription("Creates a new recipe with ingredients and instructions")
            .Produces<Recipe>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapPut("/{id}", UpdateRecipe)
            .WithName("UpdateRecipe")
            .WithSummary("Update an existing recipe")
            .WithDescription("Updates all details of an existing recipe")
            .Produces<Recipe>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapDelete("/{id}", DeleteRecipe)
            .WithName("DeleteRecipe")
            .WithSummary("Delete a recipe")
            .WithDescription("Deletes a recipe by its identifier")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/statistics/summary", GetStats)
            .WithName("GetStats")
            .WithSummary("Get recipe statistics")
            .WithDescription("Retrieves aggregated statistics about all recipes including counts, averages, and breakdowns")
            .Produces<PagedResult<Recipe>>(StatusCodes.Status200OK);

        return app;
    }

    private static async Task<IResult> GetAllRecipes(
        IRecipeService recipeService,
        string? searchTerm = null,
        DifficultyLevel? difficulty = null,
        int? maxCookingTime = null,
        RecipeSortBy? sortBy = null,
        SortDirection? sortDirection = null,
        int pageNumber = 1,
        int pageSize = 20)
    {
        try
        {
            if (pageNumber < 1)
            {
                return Results.BadRequest("Page number must be greater than or equal to 1.");
            }

            if (pageSize is < 1 or > 100)
            {
                return Results.BadRequest("Page size must be between 1 and 100.");
            }

            var recipes = await recipeService.GetRecipesAsync(
                searchTerm,
                difficulty,
                maxCookingTime,
                sortBy,
                sortDirection,
                pageNumber,
                pageSize).ConfigureAwait(false);

            return Results.Ok(recipes);
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task<IResult> GetRecipeById(int id, IRecipeService recipeService)
    {
        try
        {
            var recipe = await recipeService.GetRecipeByIdAsync(id).ConfigureAwait(false);
            return Results.Ok(recipe);
        }
        catch (InvalidOperationException)
        {
            return Results.NotFound();
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task<IResult> CreateRecipe(CreateRecipeRequest request, IRecipeService recipeService)
    {
        try
        {
            ArgumentNullException.ThrowIfNull(request);

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return Results.BadRequest("Recipe name is required.");
            }

            var recipe = await recipeService.CreateRecipeAsync(request).ConfigureAwait(false);
            return Results.Created($"/api/recipes/{recipe.Id}", recipe);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task<IResult> UpdateRecipe(int id, CreateRecipeRequest request, IRecipeService recipeService)
    {
        try
        {
            ArgumentNullException.ThrowIfNull(request);

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return Results.BadRequest("Recipe name is required.");
            }

            var recipe = await recipeService.UpdateRecipeAsync(id, request).ConfigureAwait(false);
            return Results.Ok(recipe);
        }
        catch (InvalidOperationException)
        {
            return Results.NotFound();
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task<IResult> DeleteRecipe(int id, IRecipeService recipeService)
    {
        try
        {
            await recipeService.DeleteRecipeAsync(id).ConfigureAwait(false);
            return Results.NoContent();
        }
        catch (InvalidOperationException)
        {
            return Results.NotFound();
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task<IResult> GetStats(IRecipeService recipeService)
    {
        try
        {
            var stats = await recipeService.GetStatsAsync().ConfigureAwait(false);
            return Results.Ok(stats);
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}
