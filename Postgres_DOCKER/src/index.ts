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
    createUsersTable();    //  will be created only once
    createAddressesTable();   // will be created only once


    // insertIntoAddresses();  // as many times you run this function that many rows will get added , improve the logic
    // getAddresses();
    // insertIntoUsers();
    //  getUsers();

     // The problem here is in the above four function calls we are inserting data seperating into addresses and users table which is inconsistent
     // we should encapsulate both in the same transaction
     // so we are introducing another function which does exactly the same

     insertUserAndAddress(
        'johndoe', 
        'john.doe@example.com', 
        'securepassword123', 
        'New York', 
        'USA', 
        '123 Broadway St', 
        '10001'
    );
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


async function createAddressesTable() {
    try {
        const result = await client.query(`
        CREATE TABLE IF NOT EXISTS addresses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            city VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            street VARCHAR(255) NOT NULL,
            pincode VARCHAR(20),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `);
        console.log(result);
    } catch (err) {
        console.error('Error creating Addresses table:', err);
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



async function insertIntoAddresses() {
    try {
        const result = await client.query(`
        INSERT INTO addresses (user_id, city, country, street, pincode)
        VALUES (1, 'New York', 'USA', '123 Broadway St', '10001');
        `);
        console.log(result);
    } catch (err) {
        console.error('Error inserting into users:', err);
    }
}



async function getAddresses(){
    try {
        const result = await client.query(`
        SELECT city, country, street, pincode
        FROM addresses
        WHERE user_id = 1;
        `);
        console.log(result);
    } catch (err) {
        console.error('Error retrieving users:', err);
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


async function insertUserAndAddress(
    username: string,
    email: string,
    password: string,
    city: string,
    country: string,
    street: string,
    pincode: string
){
    
    try {
        
        await client.query('BEGIN');

        // Insert User

        const insertUserText = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;  // sql injection prevented

        const userRes = await client.query(insertUserText, [username, email, password]);
        const userId = userRes.rows[0].id;

         // Insert address using the returned user ID
         const insertAddressText = `
         INSERT INTO addresses (user_id, city, country, street, pincode)
         VALUES ($1, $2, $3, $4, $5);
     `;

     await client.query(insertAddressText, [userId, city, country, street, pincode]);

      // Commit transaction
      await client.query('COMMIT');

      console.log('User and address inserted successfully');



    } catch (err){
        await client.query('ROLLBACK'); // rollback the transaction on error
        console.error('Error during the transaction , rolled back. ', err);
        throw err;
    } finally {
        await client.end(); // Close the client connection
    }
}
