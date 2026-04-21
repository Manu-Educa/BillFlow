# Copilot instructions — BillFlow

Purpose: quick reference to help Copilot sessions interact with this repository.

## Build, test, and lint commands

Backend (Spring Boot, Java 17)

- Build (Maven wrapper):
  - Windows: `backend\mvnw.cmd clean package`
  - Unix/macOS: `./backend/mvnw clean package`
- Run the app:
  - Windows: `backend\mvnw.cmd spring-boot:run`
  - Unix/macOS: `./backend/mvnw spring-boot:run`
- Tests:
  - Run all tests: `backend\mvnw.cmd test`
  - Run a single test class: `backend\mvnw.cmd -Dtest=MyTest test`
  - Run a single test method: `backend\mvnw.cmd -Dtest=MyTest#testMethod test`
- Linting/formatting: no linter or checkstyle/spotbugs plugin found in `backend/pom.xml` (none detected).

Frontend and legacy services: no build scripts detected (frontend is static `dashboard.html`; backend-services is legacy PHP).

## High-level architecture

- backend/: Java Spring Boot application (Maven wrapper present). Uses Java 17, Spring Data JPA, Spring Web (WebMVC), MySQL connector, and springdoc-openapi.
- backend-core/: placeholder for core/shared modules (currently empty in repository snapshot).
- backend-services/: legacy PHP services (PDF generation using FPDF, various PHP scripts and docs). See `backend-services/install.txt` and `backend-services/doc/`.
- frontend/: minimal static UI (`dashboard.html`).
- infra/ + `docker-compose.yml`: Docker Compose files that provide a MySQL database for local development. `infra/docker-compose.yml` references an `.env` file.

Typical local dev flow: start DB with Docker Compose, then run the backend with the Maven wrapper.

## Key conventions and repo-specific notes

- Use the Maven wrapper in `backend/` (`mvnw` / `mvnw.cmd`). Prefer the wrapper to ensure consistent Maven version.
- Project targets Java 17: see `<java.version>17</java.version>` in `backend/pom.xml`.
- OpenAPI UI is enabled via `springdoc-openapi` dependency; API docs are available when the backend runs.
- `backend-services/` relies on the FPDF library and its `font/` files — font files must be present for PDF output to work.
- Two Docker Compose variants exist: the root `docker-compose.yml` (simple DB) and `infra/docker-compose.yml` (uses `.env`). Use `docker compose -f infra/docker-compose.yml up -d` or `docker-compose -f infra/docker-compose.yml up -d` as needed.

## Where to look first for Copilot assistance

- `backend/pom.xml` and `backend/mvnw` for build/run/test commands.
- `backend/src/main` and `backend/src/test` for code and tests.
- `backend-services/` for legacy PHP services and PDF utilities.
- `infra/docker-compose.yml` to start the database used in development.

## AI assistant / CI config discovered

- No existing Copilot instructions or other assistant config files were found before creating this file (searched for CLAUDE.md, .cursorrules, AGENTS.md, .windsurfrules, AIDER_CONVENTIONS.md, .clinerules, .cline_rules).

---

Note: the repository's `.github/` directory could not be created from this environment; the file was written to `docs/copilot-instructions.md`. Move it to `.github/copilot-instructions.md` in the repo root if desired.
