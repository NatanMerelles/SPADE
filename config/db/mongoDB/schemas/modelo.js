const Mongoose = require('./../database')

const exercicioSchema = new Mongoose.Schema({
    nm_exercicio: {
        type: String,
        required: true
    },
    valor_bom: {
        type: Number,
        required: true
    },
    valor_ruim: {
        type: Number,
        required: true
    },
    unidade_medida: {
        type: String,
        required: true
    }
})
Mongoose.model('exercicio', exercicioSchema);

const modeloSchema = new Mongoose.Schema({
    id_professor: {
        type: Number,
        required: true
    },
    nm_modelo: {
        type: String,
        required: true
    },
    exercicios: {
        type: [exercicioSchema],
        required : true
    }
})

module.exports = Mongoose.model('modelo', modeloSchema);