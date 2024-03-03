// write a function to create a users table in your database.
import { Client } from 'pg'
 
const client = new Client({
  connectionString: "postgresql://postgres:mysecretpassword@localhost/postgres"
})

// async function createUsersTable() {
//     await client.connect()
//     const result = await client.query(`
//         CREATE TABLE users (
//             id SERIAL PRIMARY KEY,
//             username VARCHAR(50) UNIQUE NOT NULL,
//             email VARCHAR(255) UNIQUE NOT NULL,
//             password VARCHAR(255) NOT NULL,
//             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//         );
//     `)
//     await client.end();
//     console.log(result)
// }

async function endConnection(){
    await client.end();

}


// createUsersTable();

endConnection();

async function insertIntoUsers(){
    await client.connect();
    const result = await client.query(`
    INSERT INTO users (username, email, password)
VALUES ('Abhinandan', 'abhi@gmail.com', '123456');`
)
await client.end();

console.log(result);
}


insertIntoUsers();


async function getUsers() {

    await client.connect();
    const result = await client.query(`
    SELECT * FROM users;`)

    await client.end();

    console.log(result);

    
}


getUsers();




// import { Client } from "pg";

// // Async function to insert data into a table

// async function insertData() {

//     const client = new Client({
//         host: 'localhost',
//         port: 5432,
//         database: 'postgres',
//         user: 'postgres',
//         password: 'mysecretpassword',
//     });

//     try {
//         await client.connect();  // establish the connection
//         const insertQuery = "INSERT INTO users (username, email, password) VALUES ('username2', 'user3@example.com', 'user_password');";
//         const res = await client.query(insertQuery);
//         console.log('Insertion success:', res); // Output insertion result

//     } catch (err){
//         console.error('Error during the insertion:', err);

//     } finally {
//         await client.end(); // Close the client connection
//     }
    
// }

// insertData();