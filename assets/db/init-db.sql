CREATE DATABASE IF NOT EXISTS pizzaria;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT NOT NULL AUTO_INCREMENT,
  nome  VARCHAR(255),
  telefone VARCHAR(255),
  cep VARCHAR(255),
  endereco VARCHAR(255),
  sabor VARCHAR(255) NOT NULL,
  preco_pizza VARCHAR(255),
  custo_entrega VARCHAR(255),
  total_pedido VARCHAR(255),
  forma_pagamento VARCHAR(255),
  status VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);
