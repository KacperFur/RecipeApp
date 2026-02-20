namespace RecipeApp.Api.Models;

/// <summary>
/// Request model for creating a new recipe.
/// </summary>
public class CreateRecipeRequest
{
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
    public List<CreateIngredientRequest> Ingredients { get; set; } = [];

    /// <summary>
    /// Gets or sets the instructions for preparing the recipe.
    /// </summary>
    public string? Instructions { get; set; }
}

/// <summary>
/// Request model for creating a recipe ingredient.
/// </summary>
public class CreateIngredientRequest
{
    /// <summary>
    /// Gets or sets the name of the ingredient.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Gets or sets the quantity of the ingredient.
    /// </summary>
    public decimal Quantity { get; set; }

    /// <summary>
    /// Gets or sets the unit of measurement for the ingredient.
    /// </summary>
    public required string Unit { get; set; }
}
