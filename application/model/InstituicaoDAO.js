function InstituicaoDAO(connection){
    this._connection = connection;
}

/*InstituicaoDAO.prototype.getInstituicao = function(callback){
    this._connection.query('select * from instituicao a, endereco b where a.fk_endereco = b.id', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}
*/
InstituicaoDAO.prototype.getInstituicao = function(professor, callback){
    this._connection.query('select nm_instituicao, id from instituicao b WHERE b.fk_cd_professor ='+professor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}


InstituicaoDAO.prototype.inserirInstituicao = function(instituicao, callback){
    this._connection.query('insert into instituicao set ?', instituicao, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

InstituicaoDAO.prototype.inserirEndereco = function(endereco, callback){
    this._connection.query('insert into endereco set ?', endereco, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

module.exports = function(){
    return InstituicaoDAO
}

