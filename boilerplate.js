
import pkg from 'pg';
const { Client } = pkg;
 


let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;



const client = new Client({
    connectionString: "postgresql://abhinandansinghbaghel2001:"+PGPASSWORD+"@ep-muddy-mouse-a5fo427v.us-east-2.aws.neon.tech/Kakarot?sslmode=require"
  })


//   const client = new Client({
//     host: 'ep-muddy-mouse-a5fo427v.us-east-2.aws.neon.tech',
//     port: 5334,
//     database: 'Kakarot',
//     user: 'abhinandansinghbaghel2001',
//     password: 'f3YCKEzNMQ2Z',
//   })

async function createUsersTable() {
    await client.connect()
    const result = await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `)
    console.log(result)
}

createUsersTable();
