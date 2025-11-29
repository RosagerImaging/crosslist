# Proposed Fix for Backend Poetry Build Failure

**Case:** Backend `uv sync` failure: `ModuleOrPackageNotFoundError: No file/folder found for package api`

**Analysis:**
The `poetry` build system is failing because the project's structure does not match the configuration in `pyproject.toml`. The project is named "api", but there is no corresponding `api` package directory for `poetry` to find and build. The current layout has code (`main.py`, `src/models`) scattered in a way that `poetry` cannot recognize as a single, installable package.

**Proposed Solution:**
We will restructure the `apps/api` directory to follow a standard `src` layout that `poetry` understands, and update the `pyproject.toml` to match.

**Specific Changes:**

**Part 1: Correct `pyproject.toml`**

Update `apps/api/pyproject.toml` to correctly define the package location.

- **File:** `apps/api/pyproject.toml`
- **Old `[tool.poetry]` section:**
  ```toml
  [tool.poetry]
  packages = [
      { include = "src" }
  ]
  ```
- **New `[tool.poetry]` section:**
  ```toml
  [tool.poetry]
  packages = [
      { include = "api", from = "src" }
  ]
  ```

**Part 2: Restructure the `src` directory**

Create a proper `api` package inside the `src` folder.

- **Create Directory:** `apps/api/src/api`
- **Create File:** `apps/api/src/api/__init__.py` (can be empty)
- **Move Directory:** Move `apps/api/src/models` to `apps/api/src/api/models`.

**Part 3: Relocate Application Code**

Move the FastAPI application logic inside the new package.

- **Create File:** `apps/api/src/api/main.py` with the following content:

  ```python
  from fastapi import FastAPI

  app = FastAPI()

  @app.get("/")
  def read_root():
      return {"Hello": "World"}
  ```

- **Update `apps/api/main.py`:** Overwrite the root `main.py` to be a simple runner script:

  ```python
  import uvicorn
  from src.api.main import app

  if __name__ == "__main__":
      uvicorn.run(app, host="0.0.0.0", port=8000)
  ```

**Rationale:**
These changes create a standard, buildable Python package structure that `poetry` can correctly install in editable mode. The `pyproject.toml` now accurately points to the `api` package within the `src` directory, and the application code is properly located within that package. The root `main.py` now serves as a simple entry point to run the application, which is a common and robust pattern. This will resolve the `ModuleOrPackageNotFoundError`.
