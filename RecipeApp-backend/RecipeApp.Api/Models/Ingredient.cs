namespace RecipeApp.Api.Models;

/// <summary>
/// Represents an ingredient used in a recipe.
/// </summary>
public class Ingredient
{
    /// <summary>
    /// Gets or sets the unique identifier for the ingredient.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the ingredient.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Gets or sets the quantity of the ingredient.
    /// </summary>
    public decimal Quantity { get; set; }

    /// <summary>
    /// Gets or sets the unit of measurement for the ingredient (e.g., cups, tablespoons, grams).
    /// </summary>
    public required string Unit { get; set; }

    /// <summary>
    /// Gets or sets the ID of the recipe this ingredient belongs to.
    /// </summary>
    public int RecipeId { get; set; }
}
