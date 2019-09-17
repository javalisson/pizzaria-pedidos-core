const axios = require('axios')
const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()

const port = process.env.PORT || 3000

const miiServerHost = process.env.MII_SERVER_HOST || 'localhost'
const miiServerPort = process.env.MII_SERVER_PORT || '53100'
const miiLoginName = process.env.MII_LOGIN_NAME || 'user'
const miiLoginPassword = process.env.MII_LOGIN_PASSWORD || '1234'

app.use(cors())
app.use(express.json())

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

connection.connect(err => {
  if (err) {
    console.error("Falha ao conectar ao banco de dados:", err)
    throw err
  } else {
    console.log('Connected to database with success')
  }
})

app.get('/api', (req, res) => {
  res.send('Hello API!')
})

app.post('/api/hello-mii', (req, res) => {
  axios
    // .get(`http://${miiServerHost}:${miiServerPort}/XMII/Runner`, {
    // params: {
    //   'Transaction': 'Treinamento-2019-08/GreetingWithOutput',
    //   'name': 'Express Server',
    //   'OutputParameter': 'greeting',
    //   'Content-Type': 'text/json',
    //   'IllumLoginName': miiLoginName,
    //   'IllumLoginPassword': miiLoginPassword,
    //   'StoreTransactionOutput': 'true'
    // },
    .get(`http://${miiServerHost}:${miiServerPort}/XMII/Illuminator`, {
      params: {
        'QueryTemplate': 'Treinamento-2019-08/GreetingWithOutputXacute',
        'Param.1': 'Express Server',
        'Content-Type': 'text/json',
        'IllumLoginName': miiLoginName,
        'IllumLoginPassword': miiLoginPassword
      }
    })
    .then(response => response.data)
    .then(data => {
      // console.log(data)
      console.log(data.Rowsets.Rowset[0].Row[0].greeting)
    })
  res.send('Pedido recebido com sucesso!')
})

app.post('/api/echo', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

app.get('/api/pedido/:id', (req, res) => {
  let id = req.params.id
  let sql = `SELECT * FROM pedidos WHERE id = '${id}'`
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result[0])
  })
})

app.post('/api/pedido/:id/altera-status/:status', (req, res) => {
  let id = req.params.id
  let status = req.params.status
  let sql = `UPDATE pedidos SET status = '${status}' WHERE id = '${id}'`
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result[0])
  })
})

app.post('/api/pedido', (req, res) => {
  let status = 'pedido-recebido'
  // console.log(req.body.nome)
  let nome = req.body.nome
  // console.log(req.body.telefone)
  let telefone = req.body.telefone
  // console.log(req.body.cep)
  let cep = req.body.cep
  // console.log(req.body.endereco)
  let endereco = req.body.endereco
  // console.log(req.body.sabor)
  let sabor = req.body.sabor
  // console.log(req.body.preco_pizza)
  let preco_pizza = req.body.preco_pizza
  // console.log(req.body.custo_entrega)
  let custo_entrega = req.body.custo_entrega
  // console.log(req.body.total_pedido)
  let total_pedido = req.body.total_pedido
  // console.log(req.body.forma_pagamento)
  let forma_pagamento = req.body.forma_pagamento
  let sql = `
  INSERT INTO pedidos(
    nome,
    telefone,
    cep,
    endereco,
    sabor,
    preco_pizza,
    custo_entrega,
    total_pedido,
    forma_pagamento,
    status
  )
  VALUES (
    '${nome}',
    '${telefone}',
    '${cep}',
    '${endereco}',
    '${sabor}',
    '${preco_pizza}',
    '${custo_entrega}',
    '${total_pedido}',
    '${forma_pagamento}',
    '${status}'
  );
  `
  console.log(sql);
  connection.query(sql, (err, result) => {
    if (err) throw err
    let novoId = result.insertId;
    res.send(`{"success": true, "pedido_id": ${novoId}}`)

    axios
      .get(`http://${miiServerHost}:${miiServerPort}/XMII/Illuminator`, {
        params: {
          'QueryTemplate': 'Treinamento-setembro/aprestes/RecebePedidoXct',
          'Param.1': novoId,
          'Param.2': nome,
          'Param.3': telefone,
          'Param.4': cep,
          'Param.5': endereco,
          'Param.6': sabor,
          'Param.7': preco_pizza,
          'Param.8': custo_entrega,
          'Param.9': total_pedido,
          'Param.10': forma_pagamento,
          'Param.11': status,
          'Content-Type': 'text/json',
          'IllumLoginName': miiLoginName,
          'IllumLoginPassword': miiLoginPassword
        }
      })
      .then(response => response.data)
      .then(data => {
        console.log(data)
      })
  })
})

app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
