const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const produtosRoutes = require('./routes/produtos');
const pedidosRoutes = require('./routes/pedidos');

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
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});