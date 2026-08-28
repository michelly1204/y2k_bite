const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produtos WHERE ativo = TRUE');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/categoria/:categoria', async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const query = categoria === 'all' 
            ? 'SELECT * FROM produtos WHERE ativo = TRUE'
            : 'SELECT * FROM produtos WHERE categoria = ? AND ativo = TRUE';
        
        const [rows] = await db.query(query, categoria === 'all' ? [] : [categoria]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;