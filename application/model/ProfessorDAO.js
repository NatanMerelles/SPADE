function ProfessorDAO(connection){
    this._connection = connection;
}
ProfessorDAO.prototype.inserirProfessor = function(professor, callback){
    this._connection.query('insert into professor set ?', professor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

ProfessorDAO.prototype.realizarLogin = function(login, callback){
    this._connection.query("SELECT nm_professor, cd_confef, senha FROM professor a WHERE (a.email = '"+login+"' or a.cd_confef = '"+login+"')", callback)
    .on('error', function(err){
        console.log("[mysql error]",err);
    })
}

ProfessorDAO.prototype.nomeProfessor = function(cd_confef, callback){
    this._connection.query("select * from professor where cd_confef="+cd_confef, callback)
    .on('error', function(err){
        console.log("[mysql error]",err);
    })
}

module.exports = function(){
    return ProfessorDAO
}