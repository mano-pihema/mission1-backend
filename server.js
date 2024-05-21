const express = require('express')
const cors = require('cors')
const path = require('path')
const mysql = require('mysql2')
require('dotenv').config()

const server = express()
server.use(express.json())
server.use(cors({ origin: process.env.CLIENT }))

server.use(express.static(path.join(__dirname, 'public')))
//server.use('/public', express.static(path.join(__dirname, '../public')))

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env

const pool = mysql
  .createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise()

server.get('/', (req, res) => {
  console.log('endpt hit')
  pool
    .query(`SELECT * FROM cars`)
    .then((cars) => res.send(cars[0]))
    .catch((err) => res.status(500).send('DATABASE ERROR: ' + err.message))
})

server.post('/', (req, res) => {
  console.log('post', req.body)
  const carBody = req.body.car
  pool
    .query('SELECT * FROM cars WHERE body = ?', [carBody])
    .then((car) => res.send(car[0]))
    .catch((err) => res.status(500).send('DATABASE ERROR: ' + err.message))
})

module.exports = server
