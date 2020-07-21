function EnderecoDAO(connection){
    this._connection = connection
}

EnderecoDAO.prototype.inserirEndereco = function(valor, callback){
    console.log(valor)
    this._connection.query('insert into endereco set ?', valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

EnderecoDAO.prototype.listarEndereco = function(valor, callback){
    console.log(valor)
    this._connection.query("select * from estado where uf = ?", valor, callback)
}
EnderecoDAO.prototype.removerEndereco = function(valor, callback){
    console.log(valor)
    this._connection.query("delete from endereco where id ="+valor, callback)
}


module.exports = function(){
    return EnderecoDAO
}