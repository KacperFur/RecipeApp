namespace RecipeApp.Api.Models;

/// <summary>
/// Defines supported sort fields for recipe queries.
/// </summary>
public enum RecipeSortBy
{
    /// <summary>
    /// Sort by preparation time in minutes.
    /// </summary>
    PreparationTime = 0,

    /// <summary>
    /// Sort by difficulty level.
    /// </summary>
    Difficulty = 1
}

/// <summary>
/// Defines sorting direction for recipe queries.
/// </summary>
public enum SortDirection
{
    /// <summary>
    /// Sort in ascending order.
    /// </summary>
    Asc = 0,

    /// <summary>
    /// Sort in descending order.
    /// </summary>
    Desc = 1
}
