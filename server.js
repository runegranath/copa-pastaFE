const { Client } = require("pg");
require("dotenv").config();
const express = require("express");
const app = express();
app.set("view engine", "ejs"); // View engine: EJS
app.use(express.static("public")); // Statiska filer i katalog "public"

const bodyParser = require("body-parser"); // Möjlighet att läsa in FORM-data
app.use(bodyParser.urlencoded({ extended: true }));

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

// Route till index
app.get("/index", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM courses");
    // Skicka med kurserna från databasen
    res.render("index", { courses: result.rows }); 
  } catch (error) {
    console.error(error);
  }
});

// Route till "Lägg till kurs"-sidan
app.get("/add", async (req, res) => {
  // Läs post
  try {
    // SQL-query
    const result = await client.query("SELECT * FROM courses");

    res.render("add", { 
      errors: [],
      coursecode: "",
      coursename: "",
      syllabus: "",
      progression: ""
     });
  } catch (error) {
    console.log(error);
  }
});

app.post("/submit", async (req, res) => {
  // Läs in formulärdata
  const coursecode = req.body.kursKod;
  const coursename = req.body.kursNamn;
  const syllabus = req.body.kursPlan;
  const progression = req.body.kursProgression;

  let errors = [];

  // Validering: Alla fält måste vara ifyllda != falsy || = eller, annars skicka tillbaka till startsidan
  if (!coursecode || !coursename || !syllabus || !progression) {
    errors.push("Alla fält måste vara ifyllda");
    }

    // Om fel finns, rendera sidan igen med befintlig data och felmeddelanden
  if (errors.length > 0) {
    return res.render("add", { 
      errors: errors,
      coursecode,
      coursename,
      syllabus,
      progression
    });
  }

  // 3. Om inga fel finns, spara i databasen
  try {
    await client.query(
      "INSERT INTO courses(coursecode, coursename, syllabus, progression) VALUES($1, $2, $3, $4)",
      [coursecode, coursename, syllabus, progression],
    );
    
    // 4. Skicka användaren tillbaka till index vid lyckad sparning
    res.redirect("/index"); 

  } catch (error) {
    console.error(error);
    res.render("add", { 
        errors: ["Ett tekniskt fel uppstod i databasen."], 
        coursecode, coursename, syllabus, progression 
    });
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

// Route till "Om"-sidan
app.get("/about", (req, res) => {
  res.render("about");
});
