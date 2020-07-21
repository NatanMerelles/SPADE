
module.exports.professor = function(app, req, res){
    let connection = app.config.database()
    let professorDAO = new app.application.model.ProfessorDAO(connection)
    let instituicaoDAO = new app.application.model.InstituicaoDAO(connection)
    let turmaDAO = new app.application.model.TurmaDAO(connection)
    let modeloDAO = new app.application.model.ModeloDAO(connection)
    let dadosFormulario = req.body;
    console.log("dados formulario: ", dadosFormulario.instituicao)
    if(req.session.autorizado==undefined){
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
    function escolheInstituicao(instituicao, listaInstituicoes){
        return new Promise(function(resolve, reject){
            if(req.session.instituicao==undefined){
                if(listaInstituicoes == ""){
                    req.session.instituicao = "Sem instituicao";
                }else{
                    var indice = listaInstituicoes.length-1;
                    req.session.instituicao = listaInstituicoes[indice]   
                }
                
            }
            if(instituicao!=undefined && req.session.instituicao.id != instituicao){
               
                for(var i = 0; i<listaInstituicoes.length ;i++){
                    if(listaInstituicoes[i].id==instituicao){
                        req.session.instituicao = listaInstituicoes[i]; 
                    }
                }
            }
            resolve(req.session.instituicao)
        })
    }
        async function main(){
            let listaInstituicao = await  getInstituicoes(req.session.autorizado[0].cd_confef);
            console.log("instituicoes",listaInstituicao)
            let instituicao = await escolheInstituicao(dadosFormulario.instituicao, listaInstituicao);
            console.log("instituicao",instituicao)
            let mensagem = undefined
            if(req.session.mensagem){
                mensagem = req.session.mensagem;
                req.session.mensagem = undefined
            }
            console.log(mensagem)
            console.log(req.session.instituicao)
            res.render('professor/professor', {nome: req.session.autorizado[0].nm_professor, cd_confef: req.session.autorizado[0].cd_confef, instituicoes: listaInstituicao, instituicao: instituicao, mensagem : mensagem})
        }

        main()

}

module.exports.inserirInstituicao = function(app, req, res){
    const connection = app.config.database()
    const instituicaoDAO = new app.application.model.InstituicaoDAO(connection)
    const enderecoDAO = new app.application.model.EnderecoDAO(connection)
    const dadosFormulario = req.body
    function cadastraEndereco(){
        const endereco = [{
            cep: dadosFormulario.cep,
            numero: dadosFormulario.numero,
            estado: dadosFormulario.estado,
            cidade: dadosFormulario.cidade,
            rua: dadosFormulario.rua
        }]

        return new Promise(function(resolve, reject){
            enderecoDAO.inserirEndereco(endereco, function(error, result){
                resolve(result.insertId) 
                console.log(resolve)     
            })
        })
    }
    function removerEndereco(idEndereco){
        return new Promise(function(resolve, reject){
            instituicaoDAO.removerEndereco(idEndereco, function(error, result){
                resolve(result)
            })
        })
    }
    
    function cadastraInstituicao(idEndereco){
        const instituicao = [{
            nm_instituicao: dadosFormulario.nm_instituicao,
            fk_cd_professor: dadosFormulario.fk_cd_confef,
            fk_endereco: idEndereco            
        }]
        return new Promise(function(resolve, reject){
            instituicaoDAO.inserirInstituicao(instituicao, function(error, result){
                resolve(result.insertId)      
                console.log(resolve)
            })
        })
    }

    async function cadastra(){
        const setEndereco = await cadastraEndereco();
        if(setEndereco == undefined){
            req.session.mensagem = "Erro ao cadastrar endereco"
        }
        const setInstituicao = await cadastraInstituicao(setEndereco);
        if(setInstituicao == undefined){
            req.session.mensagem = "Erro ao cadastrar instituicao"
            await removerEndereco(setEndereco)
        }
        if(!req.session.mensagem){
            req.session.mensagem = "Sucesso ao cadastrar instituicao"
        }
        res.redirect('/professor');
    }
    cadastra();
  
}

module.exports.inserirModelo = function(app, req, res){
    const connection = app.config.database()
    const modeloDAO = new app.application.model.ModeloDAO(connection)
    const dadosFormulario = req.body
    console.log("dados formulario",dadosFormulario)

    function inserirModelo(){
        const modelo = [{
            nm_modelo: dadosFormulario.nm_modelo,
            fk_cd_confef: dadosFormulario.id_professor
        }];
        return new Promise(function(resolve, reject){
            modeloDAO.inserirModelo(modelo, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result.insertId)
            })
        })
    }
    function removerModelo(id){
        return new Promise(function(resolve, reject){
            modeloDAO.removerModelo(id, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

    function inserirExercicio(idModelo, i){
        const exercicio = [{
            nm_exercicio: dadosFormulario.nm_exercicio[i],
            bom: dadosFormulario.bom[i],
            ruim: dadosFormulario.ruim[i],
            fk_id_modelo: idModelo,
            fk_id_unidMedida: dadosFormulario.unidade_medida[i]
        }]
        console.log(exercicio)
        return new Promise(function(resolve, reject){
            modeloDAO.inserirExercicio(exercicio, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }
    
    async function main(){
        let mensagem = undefined;
        let idModelo = await inserirModelo();
        console.log("idModelo", idModelo)
        if(idModelo == undefined){
            mensagem = "Erro ao cadastrar modelo"
        }
        for(var i = 1; i < dadosFormulario.nm_exercicio.length; i++){
            let exercicio = await inserirExercicio(idModelo, i)
            console.log("exercicio", exercicio)
            if(exercicio == undefined){
                mensagem = "Erro ao cadastrar exercicio"
                await removerModelo(idModelo)
                i = dadosFormulario.nm_exercicio.length
            }
        }
        if(mensagem == undefined){
            mensagem = "Sucesso ao cadastrar modelo"
        }
        res.send(mensagem);
    }
    main()
}


module.exports.buscarModelo = function(app, req, res){
    const connection = app.config.database()
    const modeloDAO = new app.application.model.ModeloDAO(connection)
    const dadosFormulario = req.body
    console.log(dadosFormulario)

    function getModelos(confef){
        return new Promise(async function(resolve, reject){
            modeloDAO.getModelo(confef, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }
    function getExercicios(idModelo){
        return new Promise(async function(resolve, reject){
            modeloDAO.getExercicios(idModelo, function(error, result){
                if(result == null){
                    console.log('vazio')
                }
                resolve(result)
            })
        })
    }

    async function main(){
        let modelos = await getModelos(req.session.autorizado[0].cd_confef);
        for(let i = 0; i < modelos.length; i++){
            const exercicios = await getExercicios(modelos[i].id)
            if(exercicios){
                modelos[i].exercicios=exercicios;
            }
        }
        res.send(modelos)
    }
    main()
}

