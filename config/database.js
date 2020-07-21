/*
Aqui é criada a conexão com o banco de dados mysql
- require do mysql
- passar o JSON de acesso ao banco na variavel connection
- passar a variavel de conexão no module.exports 
*/
const mysql = require('mysql')

const myConnection = function(){ 
    return mysql.createConnection({
        host:'localhost',
        port:3306,
        user:'root',
        password:'',
        database:'bancotcc' 
});
}

module.exports = function(){
    return myConnection
}