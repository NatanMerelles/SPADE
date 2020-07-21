function TurmaDAO(connection){
    this._connection = connection
}

TurmaDAO.prototype.buscarTurma = function(turma, callback){
    this._connection.query('select * from turma where id='+turma, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

TurmaDAO.prototype.buscarTurmas = function(professor, instituicao, callback){
    this._connection.query('select * from turma where fk_cd_professor='+professor+' and fk_id_instituicao='+instituicao, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

TurmaDAO.prototype.verificarCDAcesso = function(chave, callback){
    this._connection.query('select chave_acesso from turma where chave_acesso='+chave, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

TurmaDAO.prototype.inserirTurma = function(turma, callback){
    this._connection.query('insert into turma set ?', turma, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

TurmaDAO.prototype.turmaAluno = function(dados, callback){
    this._connection.query('insert into turma_aluno set ?', dados, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}
TurmaDAO.prototype.editarTurma = function(id, nome, callback){
    this._connection.query('UPDATE turma SET ? where id ='+id, nome, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}


module.exports = function(){
    return TurmaDAO
}