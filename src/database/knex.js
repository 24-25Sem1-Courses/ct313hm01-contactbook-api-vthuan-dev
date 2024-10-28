require('dotenv').config({ path: '../../.env' });
const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config);


db.raw('SELECT 1')
  .then(() => {
      console.log('Database connected successfully');
  })
  .catch(err => {
      console.error('Database connection failed:', err);
  });
module.exports = db;