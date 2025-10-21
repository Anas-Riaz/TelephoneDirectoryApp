const dbConfig = require ("./dbConfig");
const sql = require("mssql")

let pool;

async function getPool(){
    if(!pool){
        pool = await sql.connect(dbConfig);
    }
    return pool;
}

module.exports = getPool;