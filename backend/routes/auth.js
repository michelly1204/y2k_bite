const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

// ROTA DE REGISTRO (CADASTRO)
router.post('/register', async (req, res) => {
    const { nome, email, senha, telefone, endereco } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        // 1. Verificar se o email já existe
        const [existingUsers] = await db.query('SELECT id FROM clientes WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Este email já está cadastrado.' });
        }

        // 2. Criptografar a senha (Hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // 3. Inserir no banco
        const [result] = await db.query(
            'INSERT INTO clientes (nome, email, senha, telefone, endereco) VALUES (?, ?, ?, ?, ?)',
            [nome, email, hashedPassword, telefone || '', endereco || '']
        );

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        // 1. Buscar usuário pelo email
        const [users] = await db.query('SELECT * FROM clientes WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const user = users[0];

        // 2. Verificar a senha
        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        // 3. Gerar o Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, nome: user.nome }, 
            process.env.JWT_SECRET || 'segredo_y2kbite_super_secreto',
            { expiresIn: '24h' }
        );

        // 4. Retornar o token e os dados do usuário
        res.json({
            message: 'Login realizado com sucesso!',
            token: token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                endereco: user.endereco
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// ROTA PARA OBTER DADOS DO PERFIL (PROTEGIDA)
const verifyToken = require('../middleware/auth');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, nome, email, telefone, endereco FROM clientes WHERE id = ?', [req.user.id]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ user: users[0] });

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro ao carregar perfil.' });
    }
});

// ROTA PARA ATUALIZAR DADOS DO PERFIL (PROTEGIDA)
router.put('/profile', verifyToken, async (req, res) => {
    const { nome, telefone, endereco } = req.body;

    try {
        await db.query(
            'UPDATE clientes SET nome = ?, telefone = ?, endereco = ? WHERE id = ?',
            [nome, telefone, endereco, req.user.id]
        );

        res.json({ message: 'Perfil atualizado com sucesso!' });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
});

module.exports = router;