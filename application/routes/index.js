module.exports = function(app){

    app.get('/', function(req, res){
        app.application.controller.index.index(app, req, res)
    })

    app.post('/cadastrar', function(req, res){
        app.application.controller.index.cadastrar(app, req, res)
    })
    
    app.post('/login', function(req, res){
        app.application.controller.index.login(app, req, res)
    })

    app.get('/sair', function(req, res){
        app.application.controller.index.sair(app, req, res)
    })

    // app.get('/confirmarEmail', function(req, res){
    //     app.application.controller.index.confirmar(app, req, res)
    // })
    
    
}