const mysql = require('mysql2/promise');

async function testar() {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            port: 3308,
            user: 'root',
            password: '',
            database: 'y2kbite_db'
        });
        
        console.log('✅ Conectou!');
        const [tables] = await conn.query('SHOW TABLES');
        console.log('Tabelas:', tables);
        await conn.end();
    } catch (err) {
        console.error('❌ Erro:', err.message);
    }
}

testar();