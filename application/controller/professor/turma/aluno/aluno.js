module.exports.aluno = function(app, req, res){
    if(req.session.autorizado==undefined){
        res.redirect("/")
        return
    }
    let connection = app.config.database()
    let alunoDAO = new app.application.model.AlunoDAO(connection)
    let instituicaoDAO = new app.application.model.InstituicaoDAO(connection)
    let avaliacaoDAO = new app.application.model.AvaliacaoDAO(connection)
    let dadosFormulario = req.query;
    console.log(dadosFormulario)
    values = dadosFormulario.id.split(".");
    aluno_id = values[0];
    turma_id = values[1];
    if(aluno_id==undefined){
        res.redirect("/")
        return
    }
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

    function getAluno(id){
        return new Promise(function(resolve, reject){
            alunoDAO.getAluno(id, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

    function buscaEsportes(id){
        return new Promise(function(resolve, reject){
            alunoDAO.buscaEsportes(id, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }   

    function buscaProblemas(id){
        return new Promise(function(resolve, reject){
            alunoDAO.buscaProblemas(id, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

   

    let mensagem = undefined
    if(req.session.mensagem){
        mensagem = req.session.mensagem;
        req.session.mensagem = undefined
    }

    async function main(){
        let listaInstituicao = await getInstituicoes(req.session.autorizado[0].cd_confef)
        let aluno = await getAluno(aluno_id)
        let esportes = await buscaEsportes(aluno_id)
        let problemas = await buscaProblemas(aluno_id)
        console.log(req.session.instituicao)
        res.render('professor/turma/aluno/aluno',{nome: req.session.autorizado[0].nm_professor, instituicoes: listaInstituicao, instituicao: req.session.instituicao,cd_confef: req.session.autorizado[0].cd_confef, aluno: aluno[0], esportes: esportes, problemas:problemas, turmaId: turma_id, mensagem: mensagem})
    }
    main()
    
}

module.exports.inserirAluno = function (app, req, res){
    const connection = app.config.database()
    const alunoDAO = new app.application.model.AlunoDAO(connection)
    const dadosFormulario = req.body
    dadosFormulario.nm_esporte = dadosFormulario.nm_esporte.split(",")
    dadosFormulario.nm_problema = dadosFormulario.nm_problema.split(",")
    console.log(dadosFormulario)
    function inserirAluno(){
        const aluno = [{
            nm_aluno : dadosFormulario.nm_aluno,
            matricula : dadosFormulario.matricula,
            dt_nascimento : dadosFormulario.dt_nascimento,
            id_imagem : dadosFormulario.id_imagem
        }]
        return new Promise(function(resolve, reject){
            alunoDAO.inserirAluno(aluno, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result.insertId)
            })
        })
    }

    function turmaAluno(idAluno, idTurma){
        const valor = [{
            fk_id_turma : idTurma,
            fk_id_aluno : idAluno
        }]
        return new Promise(function(resolve, reject){
            alunoDAO.alunoTurma(valor, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result.insertId)
            })
        })
    }

    function buscaEsporte(esporte){
        return new Promise(function(resolve, reject){
            alunoDAO.buscaEsporte(esporte, function(error, result){
                if(result == ''){
                    resolve(undefined)
                }else{
                    resolve(result[0].id)
                }
                
            })
        })
    }
    function inserirEsporte(valor){
        const esporte = [{
            nm_esporte : valor
        }];
        return new Promise(function(resolve, reject){
            alunoDAO.inserirEsporte(esporte, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result.insertId)
            })
        })
    }
    function esporteAluno(idEsporte, idAluno){
        return new Promise(function(resolve, reject){
            alunoDAO.inserirAlunoEsporte(idEsporte, idAluno, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }
    function buscaProblema(problema){
        return new Promise(function(resolve, reject){
            alunoDAO.buscaProblema(problema, function(error, result){
                if(result == ''){
                    resolve(undefined)
                }else{
                    resolve(result[0].id)
                }
                
            })
        })
    }
    function inserirProblema(valor){
        return new Promise(function(resolve, reject){
            alunoDAO.inserirProblema(valor, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                console.log("result:"+result);
                resolve(result.insertId)
            })
        })
    }
    function esporteProblema(idProblema, idAluno){
        return new Promise(function(resolve, reject){
            alunoDAO.inserirAlunoProblema(idProblema, idAluno, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                console.log(result);
                resolve(result)
            })
        })
    }
    async function main(){
        let idEsporte;
        let mensagem = undefined;
        idAluno = await inserirAluno();
        if(idAluno == undefined){
            mensagem = "Erro ao cadastrar aluno";
        }
        if(dadosFormulario.nm_esporte!=''){
            console.log(dadosFormulario.nm_esporte);
            for(var i = 1; i < dadosFormulario.nm_esporte.length ; i++){
                idEsporte = await buscaEsporte(dadosFormulario.nm_esporte[i]);
                if(idEsporte==undefined){
                    idEsporte = await inserirEsporte(dadosFormulario.nm_esporte[i])
                }
                idEsporteAluno = await esporteAluno(idEsporte, idAluno);
                if(idEsporteAluno == undefined){
                    mensagem = "Erro ao cadastrar esporte";
                }
            }
        }
        if(dadosFormulario.nm_problema!=''){
            for(var i = 1; i < dadosFormulario.nm_problema.length ; i++){
                idProblema = await buscaProblema(dadosFormulario.nm_problema[i]);
                if(idProblema==undefined){
                    idProblema = await inserirProblema(dadosFormulario.nm_problema[i])
                }
                idProblemaAluno = await esporteProblema(idProblema, idAluno);
                if(idProblemaAluno == undefined){
                    mensagem = "Erro ao cadastrar problema de saude";
                }
            }
        }
        turmaAluno = await turmaAluno(idAluno, dadosFormulario.id_turma)
        if(turmaAluno == undefined){
            mensagem = "Erro ao cadastrar aluno na turma"
        }
        if(mensagem==undefined){
            mensagem = "Sucesso ao cadastrar aluno"
        }
        res.send(mensagem)
    }    
    main()
   
}

module.exports.buscarAlunos = function(app, req, res){
    const connection = app.config.database()
    const alunoDAO = new app.application.model.AlunoDAO(connection)
    const dadosFormulario = req.body
    console.log(dadosFormulario)
    function buscarAlunos(idTurma){
        return new Promise(function(resolve, reject){
            if(Number.isInteger(Number.parseInt(idTurma))){
                alunoDAO.getAlunos(idTurma, function(error, result){
                    if(result == null){
                        console.log('vazio')
                    }
                    resolve(result)
                })
            }else{
                alunoDAO.getAlunosChave(idTurma, function(error, result){
                    if(result == null){
                        console.log('vazio')
                    }
                    console.log(result)
                    resolve(result)
                })
            }
            
        })
    }

    async function main(dados){
        let alunos = await buscarAlunos(dados.idTurma)
        res.send(alunos)
    }
    main(dadosFormulario)
}

module.exports.pesquisarAlunos = function(app, req, res){
    const connection = app.config.database();
    const alunoDAO = new app.application.model.AlunoDAO(connection)
    const dadosFormulario = req.body;
    console.log("dados busca", dadosFormulario)


    function pesquisarAlunos(turma, id, valorBusca){
        return new Promise(function(resolve, reject){
            alunoDAO.pesquisarAlunos(turma, id, valorBusca, function(error, result){
                if(result == null){
                    resolve("Nenhum resultado")
                }
                resolve(result)
            })
        })
    }

    async function main(){
        const busca = await pesquisarAlunos(dadosFormulario.idTurma, dadosFormulario.idInstituicao, dadosFormulario.busca)
        console.log(busca)
        res.send(busca)
        
    }
    main()

} 

module.exports.inserirAvaliacao = function(app, req, res){
    const connection = app.config.database();
    const avaliacaoDAO = new app.application.model.AvaliacaoDAO(connection);
    const dadosFormulario = req.body;
    console.log(dadosFormulario)

    function inserirAvaliacao(){
        const avaliacao = [{
            dt_avaliacao : dadosFormulario.dt_avaliacao,
            fk_id_aluno : dadosFormulario.fk_id_aluno,
            fk_id_modelo : dadosFormulario.fk_id_modelo
        }];
        return new Promise(function(resolve, reject){
            avaliacaoDAO.inserirAvaliacao(avaliacao, function(error, result){
                if(result == null){
                    console.log("error")
                }
                resolve(result.insertId);
            })
        })
    }

    function inserirResultado(idAvaliacao, idExercicio, valor){
        const resultado = [{
            valor : valor,
            desempenho : "",
            fk_id_exercicio : idExercicio,
            fk_id_avaliacao : idAvaliacao
        }]
        return new Promise(function(resolve, reject){
            avaliacaoDAO.inserirResultado(resultado, function(error, result){
                if(result == null){
                    console.log("error")
                }
                resolve(result);
            })
        })
    }

    async function main(){
        let mensagem = undefined;
        const avaliacao = await inserirAvaliacao();
        if(avaliacao == undefined){
            mensagem = "Erro ao cadastrar avaliacao"
        }
        for(var i = 1; i < dadosFormulario.resultado.length; i++){
            const resultado = await inserirResultado(avaliacao, dadosFormulario.fk_id_exercicio[i], dadosFormulario.resultado[i])
            if(resultado == undefined){
                mensagem = "Erro ao cadastrar resultado";
                i = dadosFormulario.resultado.length;
            }
        }
        if(mensagem==undefined){
            mensagem = "Sucesso ao cadastrar avaliacao"
        }
        res.send(mensagem)
    }
    main();
}

module.exports.buscarAvaliacoes = function(app, req, res){
    const connection = app.config.database();
    const avaliacaoDAO = new app.application.model.AvaliacaoDAO(connection);
    const dadosFormulario = req.body;
    console.log(dadosFormulario)
    
    function buscaAvaliacao(idAluno){
        return new Promise(function(resolve, reject){
            avaliacaoDAO.buscaAvaliacao(idAluno, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

    function buscaResultado(idAvaliacao){
        return new Promise(function(resolve, reject){
            avaliacaoDAO.buscaResultado(idAvaliacao, function(error, result){
                if(result == null){
                    console.log("vazio")
                }
                resolve(result)
            })
        })
    }
    async function main(){
        const avaliacoes = await buscaAvaliacao(dadosFormulario.aluno_id)
        const listAvaliacoes = [];
        for(avaliacao of avaliacoes){
            const resultado = await buscaResultado(avaliacao.id)
            avaliacao.resultado = resultado;
            if(resultado){
                listAvaliacoes.push(avaliacao);
            }
        }
        res.send(listAvaliacoes)
    }
    main()

}

module.exports.editarAvaliacao = function(app, req, res){
    const connection = app.config.database()
    const avaliacaoDAO = new app.application.model.AvaliacaoDAO(connection)
    const dadosFormulario = req.body
    console.log(dadosFormulario)

    function editarAvaliacao(valor, id){
        return new Promise(function(resolve, reject){
            avaliacaoDAO.editarResultado(valor, id, function(error, result){
                if(result == ''){
                    console.log("vazio")
                }else{
                    resolve(result)
                }
            })
        })
    }

    async function main(){
        for(let i = 0; i < dadosFormulario.fk_id_resultado.length; i++){
            await editarAvaliacao(dadosFormulario.resultado[i], dadosFormulario.fk_id_resultado[i])
        }
        res.send("ok")
    }
    main()
}

module.exports.editarAluno = function(app, req, res){
    const connection = app.config.database()
    const alunoDAO = new app.application.model.AlunoDAO(connection)
    const dadosFormulario = req.body
    console.log(dadosFormulario)

    function editarAluno(valor, id){
        return new Promise(function(resolve, reject){
            alunoDAO.editarAluno(valor, id, function(error, result){
                if(result == ''){
                    console.log("vazio")
                }else{
                    resolve(result)
                }
            })
        })
    }

    async function main(){
      valor = {
          nm_aluno : dadosFormulario.nm_aluno,
          dt_nascimento : dadosFormulario.dt_nascimento,
          matricula : dadosFormulario.matricula
      }
        await editarAluno(valor, dadosFormulario.idAluno)
        res.redirect('/professor/turma/aluno?id='+dadosFormulario.idAluno+'.'+dadosFormulario.turmaId);
    }
    main()
}

module.exports.excluirAluno = function(app, req, res){
    const connection = app.config.database()
    const alunoDAO = new app.application.model.AlunoDAO(connection)
    const dadosFormulario = req.body
    console.log(dadosFormulario)

    function excluirAluno(id){
        return new Promise(function(resolve, reject){
            alunoDAO.excluirAluno(id, function(error, result){
                if(result == ''){
                    console.log("vazio")
                }else{
                    resolve(result)
                }
            })
        })
    }

    async function main(){
        await excluirAluno(dadosFormulario.idAluno)
        res.redirect('/professor/turma?id='+dadosFormulario.turmaId);
    }
    main()
}