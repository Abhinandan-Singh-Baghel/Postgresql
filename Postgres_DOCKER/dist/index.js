"use strict";
// The problem previously was that we were using the same client connection 
// in all the functions , we can't reuse that so I have modified the code such that
// the same connection is used for all the functions
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: "postgresql://postgres:mysecretpassword@localhost/postgres"
});
// Connect to the database
client.connect()
    .then(() => {
    // Once connected, call all the functions
    createUsersTable(); //  will be created only once
    createAddressesTable(); // will be created only once
    // insertIntoAddresses();  // as many times you run this function that many rows will get added , improve the logic
    // getAddresses();
    // insertIntoUsers();
    //  getUsers();
    // The problem here is in the above four function calls we are inserting data seperating into addresses and users table which is inconsistent
    // we should encapsulate both in the same transaction
    // so we are introducing another function which does exactly the same
    insertUserAndAddress('johndoe', 'john.doe@example.com', 'securepassword123', 'New York', 'USA', '123 Broadway St', '10001');
})
    .catch(err => console.error('Error connecting to PostgreSQL:', err));
function createUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
            console.log(result);
        }
        catch (err) {
            console.error('Error creating users table:', err);
        }
    });
}
function createAddressesTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`
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
        }
        catch (err) {
            console.error('Error creating Addresses table:', err);
        }
    });
}
function insertIntoUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`
            INSERT INTO users (username, email, password)
            VALUES ('Abhinandan', 'abhi@gmail.com', '123456');
        `);
            console.log(result);
        }
        catch (err) {
            console.error('Error inserting into users:', err);
        }
    });
}
function insertIntoAddresses() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`
        INSERT INTO addresses (user_id, city, country, street, pincode)
        VALUES (1, 'New York', 'USA', '123 Broadway St', '10001');
        `);
            console.log(result);
        }
        catch (err) {
            console.error('Error inserting into users:', err);
        }
    });
}
function getAddresses() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`
        SELECT city, country, street, pincode
        FROM addresses
        WHERE user_id = 1;
        `);
            console.log(result);
        }
        catch (err) {
            console.error('Error retrieving users:', err);
        }
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`
            SELECT * FROM users;
        `);
            console.log(result);
        }
        catch (err) {
            console.error('Error retrieving users:', err);
        }
    });
}
function insertUserAndAddress(username, email, password, city, country, street, pincode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.query('BEGIN');
            // Insert User
            const insertUserText = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id;
        `; // sql injection prevented
            const userRes = yield client.query(insertUserText, [username, email, password]);
            const userId = userRes.rows[0].id;
            // Insert address using the returned user ID
            const insertAddressText = `
         INSERT INTO addresses (user_id, city, country, street, pincode)
         VALUES ($1, $2, $3, $4, $5);
     `;
            yield client.query(insertAddressText, [userId, city, country, street, pincode]);
            // Commit transaction
            yield client.query('COMMIT');
            console.log('User and address inserted successfully');
        }
        catch (err) {
            yield client.query('ROLLBACK'); // rollback the transaction on error
            console.error('Error during the transaction , rolled back. ', err);
            throw err;
        }
        finally {
            yield client.end(); // Close the client connection
        }
    });
}
