const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- Temporary in-memory data store ----
// NOTE: this resets every time the server restarts (no database).
let movies = [
  { id: 1, title: 'Interstellar', genre: 'Science Fiction', year: 2014 },
  { id: 2, title: 'Avengers: Endgame', genre: 'Action', year: 2019 },
  { id: 3, title: 'Coco', genre: 'Animation', year: 2017 },
];

let nextId = movies.length + 1;

// ---- GET /api/movies — retrieve all movies ----
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// ---- GET /api/movies/:id — retrieve one movie ----
app.get('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: `Movie with id ${id} not found` });
  }

  res.json(movie);
});

// ---- POST /api/movies — add a new movie ----
app.post('/api/movies', (req, res) => {
  const { title, genre, year } = req.body;

  if (!title || !genre || !year) {
    return res.status(400).json({
      error: 'Missing required fields. "title", "genre", and "year" are all required.',
    });
  }

  const newMovie = {
    id: nextId++,
    title: String(title),
    genre: String(genre),
    year: Number(year),
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// ---- Fallback for unknown API routes ----
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Movie API running at http://localhost:${PORT}`);
});
