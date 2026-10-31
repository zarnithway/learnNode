# LearnNode

A learning project built with Node.js, Express, and SQLite. It includes a REST API for managing todos.

## Setup

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The server listens on port `3000` by default. Set `PORT` in the environment to use a different port. `npm run dev` starts the server with nodemon.

## API

All endpoints are prefixed with `/todos`. Request and response bodies use JSON.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/todos` | List todos |
| `GET` | `/todos?done=true` | List completed todos (`done=false` lists incomplete todos) |
| `GET` | `/todos/:id` | Get a todo by ID |
| `POST` | `/todos` | Create a todo |
| `PUT` | `/todos/:id` | Update a todo |
| `DELETE` | `/todos/:id` | Delete a todo |

Create a todo with a non-empty `title` and boolean `is_done`:

```json
{
  "title": "Learn Node.js",
  "is_done": false
}
```

Updates may include either or both fields. IDs must be positive integers, and the `done` query parameter must be `true` or `false`.

Todos are stored in `todos.db` in the project root and persist across server restarts. The database and its SQLite journal files are excluded from Git.
