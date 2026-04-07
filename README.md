# NoteNext — Backend

**Overview**
- **Description:** Backend API for the NoteNext app — user auth and CRUD for personal notes.
- **Purpose:** Provides REST endpoints for registering/login and managing notes with JWT-based auth.

**Tech Stack**
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (Mongoose)

**Prerequisites**
- Node.js (v14+ recommended)
- npm
- MongoDB instance

**Environment Variables**
Create a `.env` file in the project root with the following keys:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**Installation**

```bash
# install dependencies
npm install

# run in development (with nodemon if configured)
npm run dev

# run production
npm start

# run tests
npm test
```

**Run (example)**
- Start the server and point your client to `http://localhost:5000` (or `PORT` you set).

**API Endpoints (summary)**
- **Auth**
  - `POST /api/auth/createuser` — create a new user (name, email, password)
  - `POST /api/auth/login` — login and receive JWT (email, password)

- **Notes** (require `auth-token` header with `Bearer <token>`)
  - `GET /api/notes/fetchallnotes` — fetch all notes for authenticated user
  - `POST /api/notes/addnote` — add a note (title, description, tag)
  - `PUT /api/notes/updatenote/:id` — update a note by id
  - `DELETE /api/notes/deletenote/:id` — delete a note by id

**Auth**
- The middleware `fetchuser` reads `auth-token` from request headers and sets `req.user`.

**Project Structure**
- `index.js` — app entry
- `db.js` — MongoDB connection
- `routes/auth.js` — authentication routes
- `routes/notes.js` — notes CRUD routes
- `middleware/fetchuser.js` — auth middleware
- `models/User.js`, `models/Note.js` — Mongoose models

**Helpful Notes**
- Ensure `MONGODB_URI` and `JWT_SECRET` are set correctly before starting.

---
