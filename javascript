const express = require('express');
const fetch = require('node-fetch');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL database connection
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Fetch data from API and store in database
const fetchDataAndStore = async () => {
  try {
    const response = await fetch('https://api.wazirx.com/api/v2/tickers');
    const data = await response.json();
    const top10Data = data.slice(0, 10).map((item) => ({
      name: item.name,
      last: item.last,
      buy: item.buy,
      sell: item.sell,
      volume: item.volume,
      base_unit: item.base_unit,
    }));

    await pool.query('TRUNCATE TABLE ticker_data');
    await pool.query('INSERT INTO ticker_data (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
      [top10Data.map(item => item.name), top10Data.map(item => item.last), top10Data.map(item => item.buy), top10Data.map(item => item.sell), top10Data.map(item => item.volume), top10Data.map(item => item.base_unit)]
    );
    console.log('Data stored successfully.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Route to get data from database
app.get('/tickerData', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ticker_data');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Periodically fetch data from API and store in database
setInterval(fetchDataAndStore, 60000); // Fetch data every minute

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
