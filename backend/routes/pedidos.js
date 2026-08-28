const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.nome as cliente_nome, c.telefone 
            FROM pedidos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            ORDER BY p.data_pedido DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { cliente_id, itens, forma_pagamento, endereco_entrega } = req.body;
        
        let total = 0;
        for (const item of itens) {
            const [produtos] = await connection.query('SELECT preco FROM produtos WHERE id = ?', [item.produto_id]);
            if (produtos.length === 0) {
                throw new Error(`Produto ${item.produto_id} não encontrado`);
            }
            total += produtos[0].preco * item.quantidade;
        }
        
        const [pedidoResult] = await connection.query(
            'INSERT INTO pedidos (cliente_id, total, forma_pagamento, endereco_entrega) VALUES (?, ?, ?, ?)',
            [cliente_id || null, total, forma_pagamento, endereco_entrega]
        );
        
        const pedido_id = pedidoResult.insertId;
        
        for (const item of itens) {
            const [produtos] = await connection.query('SELECT preco FROM produtos WHERE id = ?', [item.produto_id]);
            await connection.query(
                'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                [pedido_id, item.produto_id, item.quantidade, produtos[0].preco]
            );
        }
        
        await connection.commit();
        
        res.status(201).json({ 
            message: 'Pedido criado com sucesso',
            pedido_id: pedido_id,
            total: total
        });
        
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/itens', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT pi.*, p.nome as produto_nome, p.imagem
            FROM pedido_itens pi
            JOIN produtos p ON pi.produto_id = p.id
            WHERE pi.pedido_id = ?
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;