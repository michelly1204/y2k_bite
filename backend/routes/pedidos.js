const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/auth');

// 1. CRIAR UM PEDIDO REAL
router.post('/', verifyToken, async (req, res) => {
    const { itens, total, forma_pagamento, endereco_entrega } = req.body;
    const cliente_id = req.user.id;
    const itensJSON = JSON.stringify(itens);

    try {
        const [result] = await db.query(
            'INSERT INTO pedidos (cliente_id, total, itens, status, forma_pagamento, endereco_entrega) VALUES (?, ?, ?, ?, ?, ?)',
            [cliente_id, total, itensJSON, 'confirmado', forma_pagamento || 'cartao', endereco_entrega || '']
        );
        
        res.status(201).json({ 
            message: 'Pedido criado com sucesso!', 
            pedidoId: result.insertId, 
            status: 'confirmado' 
        });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ error: 'Erro ao processar o pedido.' });
    }
});

// 2. CONSULTAR O STATUS DE UM PEDIDO ESPECÍFICO
router.get('/:id/status', async (req, res) => {
    try {
        const [pedidos] = await db.query(
            'SELECT id, status FROM pedidos WHERE id = ?', 
            [req.params.id]
        );
        
        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.json({ status: pedidos[0].status });
    } catch (error) {
        console.error('Erro ao buscar status:', error);
        res.status(500).json({ error: 'Erro ao buscar status do pedido.' });
    }
});

// 3. LISTAR MEUS PEDIDOS
router.get('/meus', verifyToken, async (req, res) => {
    try {
        const [pedidos] = await db.query(
            'SELECT id, total, status, data_pedido FROM pedidos WHERE cliente_id = ? ORDER BY data_pedido DESC',
            [req.user.id]
        );
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
});

module.exports = router;