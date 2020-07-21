const multer = require('./../../config/middleware/multer')
module.exports = function(app){
app.get('/professor', function(req, res){
    console.log('rota de professor')
    app.application.controller.professor.professor.professor(app, req, res)
})

app.post('/professor', function(req, res){
    console.log('rota de professor post')
    app.application.controller.professor.professor.professor(app, req, res)
})

app.get('/professor/turma', function(req, res){
    app.application.controller.professor.turma.turma.turma(app, req, res)
})

app.post('/professor/inserirTurma', function(req, res){
    app.application.controller.professor.turma.turma.inserirTurma(app, req, res)
})

app.post('/professor/editarTurma', function(req, res){
    app.application.controller.professor.turma.turma.editarTurma(app, req, res)
})

app.post('/professor/inserirTurmaAluno', function(req, res){
    app.application.controller.professor.turma.turma.turmaAluno(app, req, res)
})

app.post('/professor/buscarTurmas', function(req, res){
    app.application.controller.professor.turma.turma.buscarTurmas(app, req, res)
})

app.post('/professor/turma/inserirAluno', multer.single('imagem'), function(req, res){
    console.log(req.file)
    if(req.file){
        req.body.id_imagem = req.file.filename
    }
    app.application.controller.professor.turma.aluno.aluno.inserirAluno(app, req, res)
})
app.post('/professor/turma/buscarAlunos', function(req, res){
    app.application.controller.professor.turma.aluno.aluno.buscarAlunos(app, req, res)
})

app.post('/professor/turma/pesquisarAlunos', function(req, res){
    app.application.controller.professor.turma.aluno.aluno.pesquisarAlunos(app, req, res)
})

app.get('/professor/turma/aluno', function(req, res){
    console.log('rota de professor')
    app.application.controller.professor.turma.aluno.aluno.aluno(app, req, res)
})


app.post('/professor/inserirInstituicao', function(req, res){
    app.application.controller.professor.professor.inserirInstituicao(app, req, res)
})

app.post('/professor/inserirModelo', function(req, res){
    app.application.controller.professor.professor.inserirModelo(app, req, res)
})
app.post('/professor/buscarModelos', function(req, res){
    app.application.controller.professor.professor.buscarModelo(app, req, res)
})



app.post('/professor/turma/aluno/inserirAvaliacao', function(req, res){
    app.application.controller.professor.turma.aluno.aluno.inserirAvaliacao(app, req, res)
})
app.post('/professor/turma/aluno/buscarAvaliacoes', function(req, res){
    app.application.controller.professor.turma.aluno.aluno.buscarAvaliacoes(app, req, res)
})
app.post('/professor/turma/aluno/editarAvaliacao', function(req, res){
    app.application.controller.professor.turma.aluno.aluno.editarAvaliacao(app, req, res)
})
app.post('/professor/turma/aluno/editarAluno', function(req, res){
    app.application.controller.professor.turma.aluno.aluno.editarAluno(app, req, res)
})
app.post('/professor/turma/aluno/excluirAluno', function(req, res){
    app.application.controller.professor.turma.aluno.aluno.excluirAluno(app, req, res)
})


}