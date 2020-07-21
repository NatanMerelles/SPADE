module.exports = function(app){
    app.post('/turma', function(req, res){
        app.application.controller.turma.turma(app, req, res)
    })

    app.post('/turma/aluno', function(req, res){
        app.application.controller.turma.aluno(app, req, res)
    })

    app.get('*', function(req, res){
        res.send('what???', 404);
      });
}