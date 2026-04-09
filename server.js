const { Client } = require("pg");
require("dotenv").config();
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Anslut till databasen
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect((err) => {
  if (err) {
    console.log("Connection error: ", err);
  } else {
    console.log("Connected to the database");
  }
});

// Routing
app.get("/", async (req, res) => {
  // Läs post
  try {
    // SQL-query
    const result = await client.query("SELECT * FROM courses");

    res.render("index", { courses: result.rows });
  } catch (error) {
    console.log(error);
  }
});

app.post("/", async (req, res) => {
  const coursecode = req.body.kursKod;
  const coursename = req.body.kursNamn;
  const syllabus = req.body.kursPlan;
  const progression = req.body.kursProgression;

  if (!coursecode || !coursename || !syllabus || !progression) {
    res.redirect("/");
  }

  try {
    // SQL-query
    const result = await client.query(
      "INSERT INTO courses(coursecode, coursename, syllabus, progression) VALUES($1, $2, $3, $4)",
      [kursKod, kursNamn, req.body.kursPlan, req.body.kursProgression],
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// Skapar en URL-route för att radera en kurs
app.post("/delete/:id", async (req, res) => {
  // Hämtar ID från URL-strängen
  const id = req.params.id; 

  try {
    // Radera rad med detta ID
    await client.query("DELETE FROM courses WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// Starta servern
app.listen(process.env.PORT, () => {
  console.log(`Server startad på http://localhost:` + process.env.PORT);
});

// Route till "Lägg till kurs"-sidan
app.get("/add", (req, res) => {
  // Söker filen views/add.ejs
    res.render("add"); 
});

// Route till "Om"-sidan
app.get("/about", (req, res) => {
    res.render("about"); 
});