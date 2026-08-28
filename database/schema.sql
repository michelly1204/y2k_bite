CREATE DATABASE IF NOT EXISTS y2kbite_db;
USE y2kbite_db;

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    imagem VARCHAR(500),
    emoji VARCHAR(10),
    badge VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    endereco TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'preparando', 'saiu', 'entregue', 'cancelado') DEFAULT 'pendente',
    total DECIMAL(10, 2) NOT NULL,
    forma_pagamento VARCHAR(50),
    endereco_entrega TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

INSERT IGNORE INTO produtos (nome, categoria, preco, descricao, imagem, emoji, badge) VALUES
('Hambúrguer Bacon Cheddar', 'burger', 24.99, 'Pão brioche, blend 180g, bacon crocante, cheddar derretido.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', '🍔', 'Mais Pedido'),
('Batata Frita Média', 'porcao', 15.00, 'Batatas crocantes com sal e tempero especial.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', '🍟', NULL),
('Coca-Cola 1L', 'bebida', 9.99, 'Refrigerante gelado.', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', '🥤', NULL),
('Combo Y2K', 'combo', 34.99, 'Hambúrguer + Batata + Coca-Cola.', 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400', '🍔', 'Combo'),
('Pudim', 'sobremesa', 14.99, 'Pudim de leite condensado com calda de caramelo.', 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400', '🍮', NULL),
('Pizza de Pepperoni', 'pizza', 29.99, 'Massa artesanal, molho de tomate, mussarela e pepperoni.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', '', NULL);

CREATE INDEX idx_categoria ON produtos(categoria);
CREATE INDEX idx_status ON pedidos(status);