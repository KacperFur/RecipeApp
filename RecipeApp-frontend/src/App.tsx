import { useState } from 'react';
import { Recipe } from './types/Recipe';
import { RecipeList } from './components/RecipeList';
import { RecipeDetails } from './components/RecipeDetails';
import { RecipeForm } from './components/RecipeForm';
import { Statistics } from './components/Statistics';
import './App.css';

type View = 'list' | 'details' | 'create' | 'edit' | 'statistics';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView('details');
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView('edit');
  };

  const handleCreateNew = () => {
    setSelectedRecipe(null);
    setCurrentView('create');
  };

  const handleSave = () => {
    setCurrentView('list');
    setSelectedRecipe(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedRecipe(null);
  };

  const handleCloseDetails = () => {
    setCurrentView('list');
    setSelectedRecipe(null);
  };

  const handleStatisticsClose = () => {
    setCurrentView('list');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍳 Recipe App</h1>
        <div className="header-buttons">
          {currentView === 'list' && (
            <>
              <button onClick={handleCreateNew} className="btn-primary">
                + Create New Recipe
              </button>
              <button 
                onClick={() => setCurrentView('statistics')} 
                className="btn-secondary"
                title="View recipe statistics"
              >
                📊 Statistics
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        {currentView === 'list' && (
          <RecipeList
            onSelectRecipe={handleSelectRecipe}
            onEditRecipe={handleEditRecipe}
            refreshTrigger={refreshTrigger}
          />
        )}

        {currentView === 'details' && selectedRecipe && (
          <RecipeDetails
            recipe={selectedRecipe}
            onClose={handleCloseDetails}
            onEdit={handleEditRecipe}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <RecipeForm
            recipe={currentView === 'edit' ? selectedRecipe || undefined : undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'statistics' && (
          <Statistics onClose={handleStatisticsClose} />
        )}
      </main>
    </div>
  );
}

export default App;
