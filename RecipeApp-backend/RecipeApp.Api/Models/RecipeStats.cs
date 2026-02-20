namespace RecipeApp.Api.Models;

/// <summary>
/// Represents recipe statistics and aggregate data.
/// </summary>
public class RecipeStats
{
    /// <summary>
    /// Gets or sets the total number of recipes.
    /// </summary>
    public int TotalRecipes { get; set; }

    /// <summary>
    /// Gets or sets the total number of unique cuisines.
    /// </summary>
    public int UniqueCuisines { get; set; }

    /// <summary>
    /// Gets or sets the average preparation time in minutes.
    /// </summary>
    public decimal AveragePreparationTime { get; set; }

    /// <summary>
    /// Gets or sets the average cooking time in minutes.
    /// </summary>
    public decimal AverageCookingTime { get; set; }

    /// <summary>
    /// Gets or sets the average total time (preparation + cooking) in minutes.
    /// </summary>
    public decimal AverageTotalTime { get; set; }

    /// <summary>
    /// Gets or sets the average servings per recipe.
    /// </summary>
    public decimal AverageServings { get; set; }

    /// <summary>
    /// Gets or sets the count of recipes by difficulty level.
    /// </summary>
    public DifficultyStats DifficultyBreakdown { get; set; } = new();

    /// <summary>
    /// Gets or sets the count of recipes by cuisine type.
    /// </summary>
    public Dictionary<Cuisine, int> CuisineBreakdown { get; set; } = [];

    /// <summary>
    /// Gets or sets the difficulty statistics breakdown.
    /// </summary>
    public class DifficultyStats
    {
        /// <summary>
        /// Gets or sets the count of easy recipes.
        /// </summary>
        public int Easy { get; set; }

        /// <summary>
        /// Gets or sets the count of medium recipes.
        /// </summary>
        public int Medium { get; set; }

        /// <summary>
        /// Gets or sets the count of hard recipes.
        /// </summary>
        public int Hard { get; set; }
    }
}
