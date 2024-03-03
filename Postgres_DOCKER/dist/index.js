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
    // Once connected, call your functions
    createUsersTable();
    insertIntoUsers();
    getUsers();
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
