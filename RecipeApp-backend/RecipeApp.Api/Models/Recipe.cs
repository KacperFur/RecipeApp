namespace RecipeApp.Api.Models;

/// <summary>
/// Represents a recipe in the application.
/// </summary>
public class Recipe
{
    /// <summary>
    /// Gets or sets the unique identifier for the recipe.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the recipe.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Gets or sets the description of the recipe.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the cooking time in minutes.
    /// </summary>
    public int CookingTimeMinutes { get; set; }

    /// <summary>
    /// Gets or sets the preparation time in minutes.
    /// </summary>
    public int PreparationTimeMinutes { get; set; }

    /// <summary>
    /// Gets or sets the number of servings.
    /// </summary>
    public int Servings { get; set; }

    /// <summary>
    /// Gets or sets the difficulty level of the recipe.
    /// </summary>
    public DifficultyLevel Difficulty { get; set; }

    /// <summary>
    /// Gets or sets the cuisine type of the recipe.
    /// </summary>
    public Cuisine Cuisine { get; set; }

    /// <summary>
    /// Gets or sets the list of ingredients for the recipe.
    /// </summary>
    public List<Ingredient> Ingredients { get; set; } = [];

    /// <summary>
    /// Gets or sets the instructions for preparing the recipe.
    /// </summary>
    public string? Instructions { get; set; }

    /// <summary>
    /// Gets or sets the creation timestamp.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the last modification timestamp.
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Enumeration of recipe difficulty levels.
/// </summary>
public enum DifficultyLevel
{
    /// <summary>Easy difficulty level.</summary>
    Easy = 0,

    /// <summary>Medium difficulty level.</summary>
    Medium = 1,

    /// <summary>Hard difficulty level.</summary>
    Hard = 2
}
