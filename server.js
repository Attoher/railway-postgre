const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Koneksi PostgreSQL dari Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase memerlukan SSL
});

// Route utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route untuk submit form
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  try {
    const query = "INSERT INTO users (name, email) VALUES ($1, $2)";
    await pool.query(query, [name, email]);
    res.send("Data berhasil disimpan ke PostgreSQL Supabase!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan.");
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
