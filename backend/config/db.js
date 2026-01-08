const { Pool } = require('pg');
require('dotenv').config();

// Patrón Singleton para la conexión a la base de datos
// Aplicando principio SRP (Single Responsibility Principle)
// Esta clase solo se encarga de la configuración y conexión a la DB
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'parking_db',
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT, 10) || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  rawQuery: (text) => pool.query(text), 
};