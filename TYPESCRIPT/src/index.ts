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

insertData();