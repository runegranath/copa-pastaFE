// Importera pg-klienten och dotenv för att läsa miljövariabler
const { Client } = require("pg");
require("dotenv").config();

// Skapa en ny pg-klient med konfiguration från .env-filen
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false, // Tillåter anslutning även om certifikatet inte är verifierat
  },
});

// Försök ansluta till databas
client.connect((err) => {
  if (err) {
    console.log("Connection error: ", err);
  } else {
    console.log("Connected to the database");
    // Om anslutningen lyckas, skapa tabellen
    createTable();
  }
});

// Funktion för att nollställa och skapa tabellen courses
async function createTable() {
  try {
    const res = await client.query(`
            /* Skapa tabellen */
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                coursecode VARCHAR(10) NOT NULL,
                coursename VARCHAR(100) NOT NULL,
                syllabus TEXT NOT NULL,
                progression VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    console.log(res);
  } catch (err) {
    console.log(err);
  } finally {
    // Stäng anslutningen till databasen när scriptet är färdigt eller vid fel
    await client.end();
  }
}
