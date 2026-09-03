const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Importar rotas
const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');
const authRoutes = require('./routes/auth'); // <--- NOVO

// Usar rotas
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes); // <--- NOVO

app.get('/api', (req, res) => {
    res.json({ 
        message: '🍔 API Y2KBite funcionando!',
        endpoints: {
            produtos: '/api/produtos',
            pedidos: '/api/pedidos',
            auth: '/api/auth' // <--- NOVO
        }
    });
});

const PORT = process.env.PORT || 3000;
const db = require('./database');

db.ready
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(() => {
        process.exitCode = 1;
    });