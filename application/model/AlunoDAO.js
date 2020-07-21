function AlunoDAO(connection){
    this._connection = connection
}

AlunoDAO.prototype.editarAluno = function(valor, id, callback){
    this._connection.query('UPDATE aluno SET ? WHERE id = '+id, valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.excluirAluno = function(id, callback){
    this._connection.query('DELETE FROM aluno WHERE id = '+id, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.inserirAluno = function(aluno, callback){
    this._connection.query('insert into aluno set ?', aluno, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.buscaEsporte = function(esporte, callback){
    this._connection.query('select id from esporte where nm_esporte='+'"'+esporte+'"', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}


AlunoDAO.prototype.inserirEsporte = function(esporte, callback){
    this._connection.query('insert into esporte set ?', esporte, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.inserirAlunoEsporte = function(esporte, aluno, callback){
    this._connection.query('INSERT INTO aluno_esporte(fk_aluno, fk_esporte) VALUES ('+aluno+','+esporte+')', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.buscaProblema = function(problema, callback){
    this._connection.query('select id from problema_saude where nm_problema='+'"'+problema+'"', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}


AlunoDAO.prototype.inserirProblema = function(problema, callback){
    this._connection.query('insert into problema_saude(nm_problema, fk_gravidade) values ('+"'"+problema+"'"+', 1)', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.inserirAlunoProblema = function(problema, aluno, callback){
    this._connection.query('INSERT INTO aluno_problema(fk_id_aluno, fk_id_problema) VALUES ('+aluno+','+problema+')', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.inserirProblemaSaude = function(problemaSaude, callback){
    this._connection.query('insert into problema_saude set ?', problemaSaude, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.alunoTurma = function(valor, callback){
    this._connection.query('insert into turma_aluno set ?', valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.getAlunos = function(valor, callback){
    this._connection.query('select * from aluno a, turma_aluno b where a.id = b.fk_id_aluno and b.fk_id_turma='+valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}
AlunoDAO.prototype.getAlunosChave = function(valor, callback){
    this._connection.query('select * from aluno a, turma_aluno b where a.id = b.fk_id_aluno and b.fk_id_turma=(select id from turma where chave_acesso = "'+valor+'")', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.pesquisarAlunos = function(turma, id, busca, callback){
    this._connection.query('SELECT a.id, a.matricula, a.nm_aluno, a.id_imagem FROM aluno a, turma b, turma_aluno c where b.id != '+turma+' and b.fk_id_instituicao = '+id+' and a.id = c.fk_id_aluno and b.id = c.fk_id_turma and (a.nm_aluno like "%'+busca+'%" or a.matricula like "%'+busca+'%")', callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}


AlunoDAO.prototype.getAluno = function(id, callback){
    this._connection.query('select * from aluno where id='+id, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.buscaEsportes = function(id, callback){
    this._connection.query('select nm_esporte from esporte a, aluno_esporte b where a.id = b.fk_esporte and b.fk_aluno ='+id, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

AlunoDAO.prototype.buscaProblemas = function(id, callback){
    this._connection.query('select nm_problema from problema_saude a, aluno_problema b where a.id = b.fk_id_problema and b.fk_id_aluno ='+id, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}



module.exports = function(){
    return AlunoDAO
}