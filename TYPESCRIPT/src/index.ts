import { Client } from 'pg'

// let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;


async function insertData() {

    
const client = new Client({
    connectionString: "postgresql://abhinandansinghbaghel2001:f3YCKEzNMQ2Z@ep-muddy-mouse-a5fo427v.us-east-2.aws.neon.tech/Kakarot?sslmode=require"
  })


  try {
    await client.connect();  
    const insertQuery = "INSERT INTO users (username, email, password) VALUES ('Abhinandan', 'asbaghel@gmail.com', 'user_password');";
    const res = await client.query(insertQuery);
    console.log('Insertion Success: ', res); // Output the insertion result

  } catch (err){
    console.error('Error during the insertion: ', err);
  } finally {
    await client.end();  // Close the client connection
  }
    
}

//insertData();

async function insertUserAndAddress(
  username: string,
  email: string,
  password: string,
  city: string,
  country: string,
  street: string,
  pincode: string
){

  const client = new Client({
    connectionString: "postgresql://abhinandansinghbaghel2001:f3YCKEzNMQ2Z@ep-muddy-mouse-a5fo427v.us-east-2.aws.neon.tech/Kakarot?sslmode=require"
  })

  try{
    await client.connect();

    // Start Transaction

    await client.query('BEGIN');

    // Insert User

    const insertUserText = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2 , $3)
    RETURNING id;`
    ;
    const userRes = await client.query(insertUserText, [username, email, password]);
    const userId = userRes.rows[0].id;

    // Commit transaction
    await client.query('COMMIT');

    console.log('User and address inserted successfully');
  } catch (err) {
    await client.query('ROLLBACK'); // Roll back the transaction on error
    console.error('Error during transaction, rolled back. ', err);
    throw err;

  } finally {
    await client.end(); // close the client connection
  }

}

// Example Usage

insertUserAndAddress(
  'Abhi',
  'abhi.cse@iitk.ac.in',
  'securepass123',
  'New York',
  'USA',
  'XYZ street',
  '2001'
);
