const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

const pool = mysql.createPool({
    ...config,
    database: process.env.DB_NAME || 'y2kbite_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10
});

async function initializeDatabase() {
    const adminConnection = await mysql.createConnection(config);
    await adminConnection.query('CREATE DATABASE IF NOT EXISTS y2kbite_db');
    await adminConnection.end();

    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8')
        .replace(/CREATE DATABASE IF NOT EXISTS y2kbite_db;\s*/i, '')
        .replace(/USE y2kbite_db;\s*/i, '')
        .split(';')
        .map(statement => statement.trim())
        .filter(Boolean);

    for (const statement of schema) {
        if (statement.startsWith('INSERT IGNORE INTO produtos')) {
            const [rows] = await pool.query('SELECT COUNT(*) AS total FROM produtos');
            if (rows[0].total > 0) {
                continue;
            }
        }

        try {
            await pool.query(statement);
        } catch (error) {
            if (error.code !== 'ER_DUP_KEYNAME') {
                throw error;
            }
        }
    }

    console.log('✅ Conectado ao MySQL com sucesso!');
}

pool.ready = initializeDatabase().catch(error => {
    console.error('❌ Erro ao inicializar o banco:', error.message);
    throw error;
});

module.exports = pool; 