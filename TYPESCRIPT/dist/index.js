"use strict";
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
// let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
function insertData() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client({
            connectionString: "postgresql://abhinandansinghbaghel2001:f3YCKEzNMQ2Z@ep-muddy-mouse-a5fo427v.us-east-2.aws.neon.tech/Kakarot?sslmode=require"
        });
        try {
            yield client.connect();
            const insertQuery = "INSERT INTO users (username, email, password) VALUES ('Abhinandan', 'asbaghel@gmail.com', 'user_password');";
            const res = yield client.query(insertQuery);
            console.log('Insertion Success: ', res); // Output the insertion result
        }
        catch (err) {
            console.error('Error during the insertion: ', err);
        }
        finally {
            yield client.end(); // Close the client connection
        }
    });
}
//insertData();
function insertUserAndAddress(username, email, password, city, country, street, pincode) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client({
            connectionString: "postgresql://abhinandansinghbaghel2001:f3YCKEzNMQ2Z@ep-muddy-mouse-a5fo427v.us-east-2.aws.neon.tech/Kakarot?sslmode=require"
        });
        try {
            yield client.connect();
            // Start Transaction
            yield client.query('BEGIN');
            // Insert User
            const insertUserText = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2 , $3)
    RETURNING id;`;
            const userRes = yield client.query(insertUserText, [username, email, password]);
            const userId = userRes.rows[0].id;
            // Commit transaction
            yield client.query('COMMIT');
            console.log('User and address inserted successfully');
        }
        catch (err) {
            yield client.query('ROLLBACK'); // Roll back the transaction on error
            console.error('Error during transaction, rolled back. ', err);
            throw err;
        }
        finally {
            yield client.end(); // close the client connection
        }
    });
}
// Example Usage
insertUserAndAddress('Abhi', 'abhi.cse@iitk.ac.in', 'securepass123', 'New York', 'USA', 'XYZ street', '2001');
