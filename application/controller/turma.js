module.exports.turma = function(app, req, res){
    const dadosFormulario = req.body;
    console.log(dadosFormulario)
    res.render('turma/turma', {turma : dadosFormulario.chave})
}

module.exports.aluno = function(app, req, res){
    let connection = app.config.database()
    let alunoDAO = new app.application.model.AlunoDAO(connection)
    const dadosFormulario = req.body;
    console.log("dados formulario",dadosFormulario)
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
    async function main(){
        let aluno = await getAluno(dadosFormulario.aluno_id)
        let esportes = await buscaEsportes(dadosFormulario.aluno_id)
        let problemas = await buscaProblemas(dadosFormulario.aluno_id)
        res.render('turma/aluno/aluno',{aluno: aluno[0], esportes: esportes, problemas:problemas})
    }
    main()
}