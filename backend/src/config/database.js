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
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT 1 as test, NOW() as server_time');
        connection.release();
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
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