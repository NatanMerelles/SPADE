function AvaliacaoDAO(connection){
    this._connection = connection;
}

AvaliacaoDAO.prototype.buscaAvaliacao = function(idAluno, callback){
    this._connection.query('select a.*, b.nm_modelo from avaliacao a, modelo b where a.fk_id_modelo = b.id and fk_id_aluno='+idAluno, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AvaliacaoDAO.prototype.buscaResultado = function(idAvaliacao, callback){
    this._connection.query('select a.nm_exercicio, a.ruim, a.bom, b.valor, b.fk_id_avaliacao, b.id FROM exercicio a, resultado b where a.id = b.fk_id_exercicio and b.fk_id_avaliacao ='+idAvaliacao, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}


AvaliacaoDAO.prototype.inserirAvaliacao = function(avaliacao, callback){
    this._connection.query('insert into avaliacao set ?', avaliacao, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AvaliacaoDAO.prototype.inserirResultado = function(resultado, callback){
    this._connection.query('insert into resultado set ?', resultado, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}
AvaliacaoDAO.prototype.editarResultado = function(valor, id, callback){
    this._connection.query('UPDATE resultado SET valor='+valor+' WHERE id ='+id, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

module.exports = function(){
    return AvaliacaoDAO
}

// class AvaliacaoDAO{
//     constructor(){
//         this._schema = require('./../../config/db/mongoDB/schemas/avaliacao')
//     }
//     async inserirAvaliacao(avaliacao){
//         return await this._schema.create(avaliacao)
//     }
//     async buscarAvaliacao(id){
//         return await this._schema.find({id_aluno : id})
//     }
// }
module.exports = ()=>{return AvaliacaoDAO}
