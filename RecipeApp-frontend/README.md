# RecipeApp Frontend

A modern React + TypeScript frontend application for managing recipes with full CRUD operations.

## Features

- **View All Recipes**: Browse all available recipes in a card grid layout
- **Recipe Details**: View detailed information about each recipe including ingredients and instructions
- **Create Recipe**: Add new recipes with ingredients and cooking instructions
- **Update Recipe**: Edit existing recipes
- **Delete Recipe**: Remove recipes from the collection

## Tech Stack

- React 18
- TypeScript
- Vite (build tool and dev server)
- CSS3 (custom styling, no frameworks)

## API Integration

The frontend integrates with the RecipeApp .NET backend API and supports all endpoints:

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/{id}` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/{id}` - Update existing recipe
- `DELETE /api/recipes/{id}` - Delete recipe

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- RecipeApp backend running on `http://localhost:5223`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
src/
├── components/          # React components
│   ├── RecipeList.tsx   # List all recipes
│   ├── RecipeDetails.tsx # View recipe details
│   └── RecipeForm.tsx   # Create/Edit recipe form
├── services/
│   └── recipeService.ts # API service layer
├── types/
│   └── Recipe.ts        # TypeScript type definitions
├── App.tsx              # Main app component
├── App.css              # Application styles
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Recipe Model

Each recipe contains:
- Name (required)
- Description (optional)
- Cooking time and preparation time (in minutes)
- Servings
- Difficulty level (Easy, Medium, Hard)
- List of ingredients (name, quantity, unit)
- Instructions (optional)
- Timestamps (created and updated)

## Development

The Vite dev server includes a proxy configuration that forwards all `/api` requests to the backend at `http://localhost:5223`, avoiding CORS issues during development.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
