// Importera nödvändiga moduler
const { Client } = require("pg");                     // PostgreSQL
require("dotenv").config();                           // Miljövariabler från .env
const express = require("express");          
const app = express();
app.set("view engine", "ejs");                        // View engine: EJS
app.use(express.static("public"));                    // Statiska filer i katalog "public"

const bodyParser = require("body-parser");            // Möjlighet att läsa in FORM-data
app.use(bodyParser.urlencoded({ extended: true }));

// Anslut till databasen med miljövariabler för säkerhet
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

// Försök ansluta till DB
client.connect((err) => {
  if (err) {
    console.log("Connection error: ", err);
  } else {
    console.log("Connected to the database");
  }
});

// Route till startsidan, omdirigerar till index
app.get("/", (req, res) => {
  res.redirect("/index");
});

// Route till index, hämtar alla kurser och skickar till index.ejs för rendering
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
      errors: [],         // Tom array för felmeddelanden
      coursecode: "",     // Tomma strängar så formuläret är tomt vid start
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

    // Om fel finns, rendera sidan igen med behålld befintlig data och felmeddelanden
  if (errors.length > 0) {
    return res.render("add", { 
      errors: errors,
      coursecode,
      coursename,
      syllabus,
      progression
    });
  }

    // Om inga fel finns, spara i databasen
  try {
    // Använder parametrar för att undvika SQL-injektion
    await client.query(
      "INSERT INTO courses(coursecode, coursename, syllabus, progression) VALUES($1, $2, $3, $4)",
      [coursecode, coursename, syllabus, progression],
    );
    
    // Skicka användaren tillbaka till index vid lyckad sparning
    res.redirect("/index"); 

  } catch (error) {
    console.error(error);
    res.render("add", { 
    // Rendera generellt felmeddelande och behåll användarens befintliga inmatning
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
    res.redirect("/index");
  } catch (error) {
    console.error(error);
    res.redirect("/index");
  }
});

// Route till "Om"-sidan
app.get("/about", (req, res) => {
  res.render("about");
});

// Starta servern
app.listen(process.env.PORT, () => {
  console.log(`Server startad på http://localhost:` + process.env.PORT);
});