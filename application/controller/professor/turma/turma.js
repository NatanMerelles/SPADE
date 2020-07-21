module.exports.turma = function(app, req, res){
    if(req.session.autorizado==undefined){
        res.redirect("/")
        return
    }
    let connection = app.config.database()
    let alunoDAO = new app.application.model.AlunoDAO(connection)
    let instituicaoDAO = new app.application.model.InstituicaoDAO(connection)
    let dadosFormulario = req.query;
    if(dadosFormulario.id==undefined){
        res.redirect("/")
        return
    }
    console.log(dadosFormulario)
    function getInstituicoes(confef){
        return new Promise(function(resolve, reject){
            instituicaoDAO.getInstituicao(confef, function(error, result){  
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }
    async function main(){
        let mensagem = undefined
    if(req.session.mensagem){
        mensagem = req.session.mensagem;
        req.session.mensagem = undefined
    }console.log(req.session.instituicao)
        let listaInstituicao = await  getInstituicoes(req.session.autorizado[0].cd_confef);
        res.render('professor/turma/turma',{nome: req.session.autorizado[0].nm_professor, instituicoes: listaInstituicao,cd_confef: req.session.autorizado[0].cd_confef, instituicao: req.session.instituicao, turma: dadosFormulario.id, mensagem: mensagem})
    }
    main()
}

module.exports.inserirTurma = function (app, req, res){
    const connection = app.config.database()
    const turmaDAO = new app.application.model.TurmaDAO(connection)
    const dadosFormulario = req.body

    function criarChaveAcesso(){
        let chaveAcesso = '';
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 6; i++){
            chaveAcesso += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return chaveAcesso
    }
    function verificarChaveAcesso(chaveAcesso){
        return new Promise(function(resolve, reject){
            turmaDAO.verificarCDAcesso(chaveAcesso, function(error, result){
                if(error){
                    resolve(true)
                }else{
                    resolve(false);
                }
                
            })
        })
    }
    function setTurma(valor){
        return new Promise(function(resolve, reject){
            turmaDAO.inserirTurma(valor, function(error, result){
                resolve(result);
            })
        })
    }
    function buscaTurma(valor){
        return new Promise(function(resolve, reject){
            turmaDAO.buscarTurma(valor, function(error, result){
                resolve(result);
            })
        })
    }


    async function main(valor){
        let mensagem = undefined
        let turma = undefined
        let value = {
            nm_turma : valor.nm_turma,
            fk_id_instituicao : valor.fk_id_instituicao,
            fk_cd_professor : valor.fk_cd_professor,
            chave_acesso : undefined
        }
        let verificar = false
        while(verificar == false){
            value.chave_acesso = criarChaveAcesso();
            verificar = await verificarChaveAcesso(value.chave_acesso);
        }
        if (verificar = true){
            turma = await setTurma(value);
            if(turma == undefined){
                mensagem = "Erro ao cadastrar turma"
            }
        }
        if(mensagem == undefined){
            mensagem = "Sucesso ao cadastrar turma"
        }
            const resultados = {
                mensagem : mensagem,
                turma : await buscaTurma(turma.insertId)
            }
            res.send(resultados)
        // res.redirect('/professor');
    }

    main(dadosFormulario);
}

module.exports.buscarTurmas = function(app,req,res){
    const connection = app.config.database()
    const turmaDAO = new app.application.model.TurmaDAO(connection)
    const dadosFormulario = req.body
    console.log(dadosFormulario)

    function getTurmas(confef, instituicao){
        return new Promise(function(resolve, reject){
            turmaDAO.buscarTurmas(confef, instituicao, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

    async function main(dadosFormulario){
        const turmas = await getTurmas(dadosFormulario.fk_cd_professor, dadosFormulario.fk_id_instituicao)
        console.log(turmas)
        res.send(turmas)
    }
    main(dadosFormulario)
}

module.exports.turmaAluno = function(app, req, res){
    const connection = app.config.database()
    const turmaDAO = new app.application.model.TurmaDAO(connection)
    const dadosFormulario = req.body

    function turma_aluno(dados){
        return new Promise(function(resolve, reject){
            turmaDAO.turmaAluno(dados, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

    async function main(){
        const turmaAluno = {
            fk_id_aluno : dadosFormulario.idAluno,
            fk_id_turma : dadosFormulario.idTurma
        }
        await turma_aluno(turmaAluno)
    }
    main()
}

module.exports.editarTurma = function(app, req, res){
    const connection = app.config.database()
    const turmaDAO = new app.application.model.TurmaDAO(connection)
    const dadosFormulario = req.body

    function editarTurma(id, nome){
        return new Promise(function(resolve, reject){
            turmaDAO.editarTurma(id, nome, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

    async function main(){
        const dados = {
            nm_turma : dadosFormulario.nm_turma
        }
        await editarTurma(dadosFormulario.id_turma, dados)
        res.redirect('/')
    }
    main()
}