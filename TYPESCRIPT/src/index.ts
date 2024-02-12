import pkg from 'pg';
const { Client } = pkg;
 


let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;



const client = new Client({
    connectionString: "postgresql://abhinandansinghbaghel2001:"+PGPASSWORD+"@ep-muddy-mouse-a5fo427v.us-east-2.aws.neon.tech/Kakarot?sslmode=require"
  })

  