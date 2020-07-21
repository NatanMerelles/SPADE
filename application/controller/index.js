
module.exports.index = function(app, req, res){
    if(req.session.autorizado != undefined){
        console.log(req.session.autorizado)
        res.redirect('/professor')
    }else{
        res.render('index')
    }
}

module.exports.login = function(app, req, res){
    const bcrypt = require('bcrypt')
    const connection = app.config.database()
    const professorDAO = new app.application.model.ProfessorDAO(connection)
    const dadosFormulario = req.body

    console.log(dadosFormulario);
    
    function loginProfessor(login, senha){
        return new Promise(function(resolve, reject){
            professorDAO.realizarLogin(login, function(error, result){
                if(error){
                    res.redirect('/')
                    return
                }
                if(result ==''){
                    res.redirect('/')
                    return
                }
                console.log("teste", result)
                bcrypt.compare(senha, result[0].senha, function(err, res) {
                    console.log(res)
                    if(res == true){
                        const professor = [{
                            nm_professor : result[0].nm_professor,
                            cd_confef : result[0].cd_confef
                        }]
                        resolve(professor)
                    }else{
                        console.log("senha nao confere")
                    }
                });
                
            })
        })
    }

    async function main(login, senha){
        let professor = await loginProfessor(login, senha);
        req.session.autorizado = professor;
        console.log(req.session.autorizado)
        res.redirect('/professor')
    }

    main(dadosFormulario.login, dadosFormulario.senha)
    
}
        
    

module.exports.cadastrar = function(app, req, res){
    const bcrypt = require('bcrypt')
    const connection = app.config.database()
    const professorDAO = new app.application.model.ProfessorDAO(connection)
    const dadosFormulario = req.body
    console.log(dadosFormulario.confirmaSenha)

    req.assert('cd_confef', 'Confef deve possuir 11 digitos').len(11)
    req.assert('cd_confef', 'Digite um codigo da Confef').notEmpty()
    req.assert('senha', 'Senha maior que 30 digitos').len(1, 30)
    req.assert('senha', 'Digite uma senha').notEmpty()
    req.assert('nm_professor', 'Nome maior que 100 digitos').len(1, 100)
    req.assert('nm_professor', 'Digite um nome').notEmpty()
    req.assert('email', 'Email maior que 100 digitos').len(1, 100)
    req.assert('email', 'Digite um Email').notEmpty()

    


    const erros = req.validationErrors()
    console.log(erros)
    if(erros){
        res.render('index')
        return
    }

    function inserirProfessor(){
        return new Promise(function(resolve, reject){
            if(dadosFormulario.senha == dadosFormulario.confirmaSenha){
                const professor = {
                    cd_confef  : dadosFormulario.cd_confef,
                    nm_professor : dadosFormulario.nm_professor,
                    email : dadosFormulario.email,
                    senha : dadosFormulario.senha
                };
                console.log(professor)
                bcrypt.hash(professor.senha, 10, function(err, hash){
                    professor.senha = hash;
                    console.log(professor)
                    console.log(hash)
                    professorDAO.inserirProfessor(professor, function(error, result){
                        if(error){
                            console.log(error)
                            return
                        }
                        if(result == ''){
                            resolve(result)
                        }
                        console.log(result)
                        resolve(result)
                    })
                })
            }
        })
    }

    function inviarEmail(confef){
        return new Promise(function(resolve, reject){
            
        })
    }

    async function main(){
        const professor = await inserirProfessor();
        if(professor != ''){
            res.redirect('/')

        }else{
            res.redirect('/?msg=nao-cadastrado')
        }
    }
    main();
    

    
    
}


module.exports.sair = function(app, req, res){
    req.session.autorizado = undefined
    req.session.instituicao = undefined
    res.redirect("/")
}