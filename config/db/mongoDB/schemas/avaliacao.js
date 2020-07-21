const Mongoose = require('./../database')


const resultadoSchema = new Mongoose.Schema({
    id_exercicio : {
        type : Mongoose.Schema.Types.ObjectId,
        ref : 'exercicio',
        required : true
    },
    valor : {
        type : Number,
        required : true
    }
    
})

const avaliacaoSchema = new Mongoose.Schema({
    id_aluno : {
        type: Number,
        required: true
    },
    id_modelo : {
        type: Mongoose.Schema.Types.ObjectId, 
        ref: 'modelo',
        required: true
    },
    data_avaliacao : {
        type: Date,
        required:true
    },
    resultados : {
        type : [resultadoSchema],
        required : true
    }

})

module.exports = Mongoose.model('avaliacao', avaliacaoSchema)