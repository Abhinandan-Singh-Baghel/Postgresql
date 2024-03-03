// The problem previously was that we were using the same client connection 
// in all the functions , we can't reuse that so I have modified the code such that
// the same connection is used for all the functions


import { Client } from 'pg';

const client = new Client({
  connectionString: "postgresql://postgres:mysecretpassword@localhost/postgres"
});

// Connect to the database
client.connect()
  .then(() => {
    // Once connected, call all the functions
    createUsersTable();
    insertIntoUsers();
    getUsers();
  })
  .catch(err => console.error('Error connecting to PostgreSQL:', err));

async function createUsersTable() {
    try {
        const result = await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log(result);
    } catch (err) {
        console.error('Error creating users table:', err);
    }
}

async function insertIntoUsers() {
    try {
        const result = await client.query(`
            INSERT INTO users (username, email, password)
            VALUES ('Abhinandan', 'abhi@gmail.com', '123456');
        `);
        console.log(result);
    } catch (err) {
        console.error('Error inserting into users:', err);
    }
}

async function getUsers() {
    try {
        const result = await client.query(`
            SELECT * FROM users;
        `);
        console.log(result);
    } catch (err) {
        console.error('Error retrieving users:', err);
    }
}
