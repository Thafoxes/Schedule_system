const mysql = require('mysql2/promise');
require('dotenv').config();

//databse connection config
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3308'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'schedule_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    multipleStatements: true,
    ssl: false
};

// create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
    let connection = null;
    try {
       // Step 1: Test basic MySQL server connection (without database)
        console.log('📋 Step 1: Testing MySQL server connection...');
        const basicConfig = {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password
        };
        
        const testConn = await mysql.createConnection(basicConfig);
        console.log('✅ Step 1: MySQL server connection successful');
        
        // Step 2: Check if database exists
        console.log('📋 Step 2: Checking if database exists...');
        const [databases] = await testConn.execute(`SHOW DATABASES LIKE '${dbConfig.database}'`);
        
        if (databases.length === 0) {
            console.log(`❌ Step 2: Database '${dbConfig.database}' does not exist`);
            console.log('💡 Solution: Create the database first:');
            console.log(`   CREATE DATABASE ${dbConfig.database};`);
            await testConn.end();
            return false;
        }
        
        console.log(`✅ Step 2: Database '${dbConfig.database}' exists`);
        await testConn.end();
        
        // Step 3: Test pool connection with database
        console.log('📋 Step 3: Testing connection pool with database...');
        const poolConn = await pool.getConnection();
        console.log('✅ Step 3: Database pool connection successful');
        
        // Step 4: Test simple query
        console.log('📋 Step 4: Testing database query...');
        const [rows] = await poolConn.execute('SELECT 1 as test, NOW() as server_time');
        console.log('✅ Step 4: Database query test passed:', {
            test_result: rows[0].test,
            server_time: rows[0].server_time
        });
        
        poolConn.release();
        console.log('✅ All database tests passed!\n');
        return true;

    }  catch (error) {
        if (connection) {
            try {
                await connection.end();
            } catch (closeError) {
                console.error('Error closing connection:', closeError.message);
            }
        }

        console.error('❌ Database connection failed:');
        console.error(`   Error Code: ${error.code}`);
        console.error(`   Error Message: ${error.message}`);
        
        
        return false;
    }
};

// Execute stored procedure helper
const executeStoredProcedure = async (procedureName, params = []) => {
    try {
        const connection = await pool.getConnection();
        
        // Build the CALL statement with proper parameter placeholders, parameters with ,
        const placeholders = params.length > 0 ? params.map(() => '?').join(', ') : '';
        const query = `CALL ${procedureName}(${placeholders})`;
        
        console.log(`🔧 Executing procedure: ${procedureName}`, params);
        
        const [rows] = await connection.execute(query, params);
        connection.release();
        
        return rows;
    } catch (error) {
        console.error(`❌ Error executing procedure ${procedureName}:`, error.message);
        throw error;
    }
};

// Execute regular query helper
const executeQuery = async (query, params = []) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(query, params);
        connection.release();
        return rows;
    } catch (error) {
        console.error('❌ Error executing query:', error.message);
        throw error;
    }
};

// Close all connections (for graceful shutdown)
const closePool = async () => {
    try {
        await pool.end();
        console.log('🔒 Database pool closed');
    } catch (error) {
        console.error('❌ Error closing database pool:', error.message);
    }
};

module.exports = {
    pool,
    testConnection,
    executeStoredProcedure,
    executeQuery,
    closePool
};