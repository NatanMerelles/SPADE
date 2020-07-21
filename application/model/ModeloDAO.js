function ModeloDAO(connection){
    this._connection = connection
}


ModeloDAO.prototype.getModelo = function(valor, callback){
    this._connection.query('select * from modelo where fk_cd_confef='+valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

ModeloDAO.prototype.inserirModelo = function(valor, callback){
    this._connection.query('insert into modelo set ?', valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}
ModeloDAO.prototype.removerModelo = function(valor, callback){
    this._connection.query('delete from modelo where id='+valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

ModeloDAO.prototype.inserirExercicio = function(valor, callback){
    this._connection.query('insert into exercicio set ?', valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}


ModeloDAO.prototype.getExercicios = function(valor, callback){
    this._connection.query('select * from exercicio a where a.fk_id_modelo ='+valor, callback)
    .on('error', function(err) {
        console.log("[mysql error]",err);
    });
}

// module.exports = function(){
//     return ModeloDAO
// }

// class ModeloDAO{
//     constructor(){
//         this._schema = require('./../../config/db/mongoDB/schemas/modelo')
//     }
//     async buscarModelo(id){
//         return await this._schema.find({id_professor : id})
//     }

//     async inserirModelo(modelo){
//         return await this._schema.create(modelo)
//     }
// }

module.exports = ()=>{return ModeloDAO}