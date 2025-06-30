# 🧪Backend JS (TypeScript Edition)

This is a **Node.js + Koa + TypeScript** backend service for managing Issues and their revision history. It supports authentication, full CRUD with audit, revision diffs, and MySQL-based persistence. The app is fully containerized with Docker and ready for local or cloud deployment.

---

## ✨ Features

* CRUD operations for Issues (with audit fields)
* **Automatic revision history** on every update
* JWT-based Authentication
* `X-Client-ID` header enforcement
* Compare any two issue revisions (detailed diff)
* MySQL database (8.x) persistence via Sequelize
* TypeScript codebase, full type safety
* Ready for Docker + Docker Compose
* Smart environment variable loading
* Linting with ESLint & Prettier

---

## 🗂️ Project Structure

```
.
├── src/
│   ├── index.ts              # Main entry point
│   ├── config.ts             # Centralized configuration
│   ├── load-env.ts           # Environment loader
│   ├── lib/
│   │   ├── api/              # Route handlers (controllers)
│   │   ├── middleware/       # Auth & error middleware
│   │   ├── models/           # Sequelize models
│   │   └── routes/           # Koa router setup
│   └── ...
├── docker-compose.yml
├── Dockerfile
├── .env, .env.docker, etc.
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file for **local development**:

```env
NODE_ENV=development
PORT=8080

MYSQLDB_ROOT_PASSWORD=secret
MYSQLDB_DATABASE=issue_db
MYSQLDB_USER=root
MYSQLDB_LOCAL_PORT=3307
MYSQLDB_DOCKER_PORT=3306

JWT_SECRET=supersecret
```

For Docker, use `.env.docker` (make sure it matches the variables above).

---

## 🧑‍💻 Local Development (No Docker)

1. **Install Dependencies**:

   ```bash
   npm ci
   ```

2. **Start MySQL** (e.g. via XAMPP/Docker/CLI)

3. **Create Database**:

   ```sql
   CREATE DATABASE issue_db;
   ```

4. **Build & Run the App**:

   ```bash
   npm run build
   npm start
   ```

   * or use TypeScript directly for dev with hot-reload:

   ```bash
   npm run dev
   ```

5. **Test the API** using Postman/curl.

---

## 🐳 Dockerized Setup

> Make sure Docker & Docker Compose are installed and running.

1. **Check `.env.docker`** is present in the root directory (see sample above).

2. **Build & Start Everything**:

   ```bash
   docker compose up --build
   ```

   * This spins up both the backend app and MySQL, initializes schema.

3. **Access the API**:

   ```
   http://localhost:8080
   ```

---

## 🔐 Authentication

* All endpoints (except `/health` and `/token`) require:

  * `Authorization: Bearer <jwt>`
  * `X-Client-ID: your-client-id`

* **Get JWT Token:**

  ```bash
  curl -X POST http://localhost:8080/token \
    -H "X-Client-ID: test-client" \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@testlio.com"}'
  ```

---

## 🧪 Main Endpoints

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| POST   | `/token`                | Generate JWT                   |
| GET    | `/issues/:id`           | Get issue                      |
| POST   | `/issues`               | Create issue                   |
| PUT    | `/issues/:id`           | Update issue                   |
| DELETE | `/issues/:id`           | Delete issue                   |
| GET    | `/issues/:id/revisions` | Get all revisions for an issue |
| GET    | `/issues/:id/compare`   | Compare two revisions          |

**Compare Example:**

```bash
curl "http://localhost:8080/issues/1/compare?revA=2&revB=5" \
  -H "Authorization: Bearer <token>" \
  -H "X-Client-ID: test"
```

---

## 🧹 Linting & Formatting

Run ESLint:

```bash
npx eslint . --fix
```

---

## 🧪 Running Unit Tests

* Run all tests with:

  ```bash
  npm test
  # or
  npm run test
  ```

* Coverage:

  ```bash
  npm run test:coverage
  ```

---

## 🛠 Tech Stack

* Node.js + TypeScript
* Koa.js
* Sequelize (MySQL)
* Docker & Docker Compose
* JWT Auth
* ESLint, Prettier, Vitest

---

## ⚡ Troubleshooting

* **Environment Variables Not Loading in Docker?**

  * Make sure `.env.docker` is present at project root
  * `env_file: .env.docker` in `docker-compose.yml`
  * Variable substitution in `docker-compose.yml` works from `.env` (rename if needed).

* **Build Errors?**

  * Ensure `npm run build` outputs to `dist/`
  * Dockerfile `CMD` runs `node dist/index.js`

* **Database Issues?**

  * Wait for the DB to be healthy (see Compose logs)
  * Ensure your MySQL container exposes port 3306 and credentials match

