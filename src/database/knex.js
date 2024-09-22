require('dotenv').config({ path: '../../.env' });

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

console.log('DB_HOST:', DB_HOST);
console.log('DB_PORT:', DB_PORT);
console.log('DB_USER:', DB_USER);
console.log('DB_PASS:', DB_PASS);
console.log('DB_NAME:', DB_NAME);

const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME
    },
    pool: {
        min: 0,
        max: 10
    }
});

module.exports = knex;