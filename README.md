# Prompt & workflow log

## Overview of the app

RecipeApp is a full-stack recipe manager with a .NET 9 Minimal API backend and a React + TypeScript frontend. It supports CRUD, search, sorting, pagination, cuisine types, and a statistics endpoint with breakdowns.

## Prompt history (key steps)

1) Initial backend scaffolding
- Prompt: "You are experienced .NET developer, follow dotnet-best-practises.prompt.md and build web api for managing list of recipes."
- Result: Minimal API for recipes with CRUD endpoints, models, repository/service layers, and Swagger.
- Accepted/changed: Accepted core structure; later refined per follow-up prompts.

2) Search support
- Prompt: "following dotnet best practises add searching functionality while getting list of recepies"
- Result: Added searchTerm filtering in list endpoint and repository.
- Accepted/changed: Accepted; ensured case-insensitive matching.

3) Sorting and pagination
- Prompt: "following dotnet-best-practises.prompt.md add sorting by preparation time and difficulty level, implement pagination as well"
- Result: Added sort enums, pagination model, page validation, and ordering in repository.
- Accepted/changed: Accepted; validated pageNumber/pageSize and exposed in endpoint.

4) Cuisine and statistics
- Prompt: "Following dotnet-best-practises-prompt.md Update exsisting models with type of cousine of each dish (generate some values to pick from) and implement stats endpoint, with some useful statistics connected with recepies, add \"other\" type to cousine to allow user to add type that is not in the app"
- Result: Added Cuisine enum (including Other), wired cuisine to models and CRUD, and created stats endpoint with averages and breakdowns.
- Accepted/changed: Accepted; ensured stats include cuisine breakdown and totals.

5) Frontend scaffolding
- Prompt: "Build frontend app for RecipeApp-backend, make sure that all of the enpoints will be fully supported"
- Result: React + TypeScript frontend with list, details, create/edit, and stats views; API service layer.
- Accepted/changed: Accepted; iterated with later fixes.

6) Frontend search alignment
- Prompt: "Get Recipies endpoint has changed, searching was added, analyze it and fix frontend logic to handle it"
- Result: Updated list view to include searchTerm in requests and UI.
- Accepted/changed: Accepted; kept query params consistent with backend.

7) Cuisine selection in UI
- Prompt (later request): "make sure that while adding and editing recipie user can choose cousine type"
- Result: Added cuisine dropdown to create/edit form; displayed cuisine in list and details; updated types.
- Accepted/changed: Accepted; default cuisine set for new recipes.

8) Statistics cuisine labels (fixes)
- Prompt: "in statistics cuisine breakdown each cuisine is showed as unknown"
- Result: Updated label mapping to handle numeric and string enum values.
- Accepted/changed: Adjusted frontend to pass cuisine keys directly when backend returns strings.

9) Repeat fix verification
- Prompt: "it is still unknown"
- Result: Found parsing bug in Statistics component; removed parseInt and passed string key to label helper.
- Accepted/changed: Accepted; now handles cuisine names from backend.


## Context provided to AI

- Project description: Build a Recipe management web API and a matching frontend.
- Constraints: Follow dotnet-best-practises.prompt.md; support CRUD, search, sorting, pagination; add cuisine types and stats; keep frontend in sync.
- Existing code: Started from a backend-only repo, later added a frontend for all endpoints.
- Environment: Windows, VS Code, .NET 9, React + TypeScript, Vite.

## Tools/models/MCP used

- GitHub Copilot in VS Code (model: GPT-5.2-Codex).
- VS Code tools: file edits and reads, running local commands via terminals.
- External tools: dotnet CLI and npm scripts for build/run (no external services).
- MCP servers: none used.

## Insights and recommendations for future use of Copilot

- When a bug repeats, ask Copilot to inspect the raw API payload and trace it to the UI.
- Keep prompt history in a single file and update it as changes land to preserve context.
- Run a quick end-to-end smoke test after schema or enum changes.

## Tests and validation

- dotnet build: succeeded during backend work.
- dotnet run / npm run dev: attempted but failed at times due to process/environment issues; not fully validated end-to-end.
- Manual validation: API responses reviewed to align frontend types and stats parsing.