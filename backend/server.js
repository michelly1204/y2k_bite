const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');
const db = require('./database');

app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.get('/api', (req, res) => {
    res.json({ 
        message: '🍔 API Y2KBite funcionando!',
        endpoints: {
            produtos: '/api/produtos',
            pedidos: '/api/pedidos'
        }
    });
});

const PORT = process.env.PORT || 3000;

db.ready
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(() => {
        process.exitCode = 1;
    });