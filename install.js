const { Client } = require("pg");
require("dotenv").config();

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
    createTable();
  }
});

async function createTable() {
  try {
    const res = await client.query(`
            DROP TABLE IF EXISTS courses;
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
    await client.end();
  }
}
