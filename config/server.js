/*
Esse é o arquivo de server é instanciado o express e setado as configurações do mesmo, é iniciado o uso dos midlewares, e atribuidos os modulos na variavel principal através do consign
- Necessário instanciar o express, bodyParser, express-validator
 exportar a variavel do express através do module.exports
*/

const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const consign = require('consign')
const session = require('express-session')


const app = express()
app.set('view engine', 'ejs')
app.set('views', './application/view')
app.set('trust proxy', 1)

app.use(express.static('./application/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(expressValidator())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }))


consign()
.include('application/routes')
.then('config/database.js')
.then('application/model')
.then('application/controller')
.into(app)

module.exports = app
