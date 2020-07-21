$(document).ready(function(){
    $('#selectInstituicao').change(function(){
        if(this.value == "nova"){
            $('#novaInstituicao').click();
        }else{
            $('#instituicao').submit();
        }
    })
})

// function selectInstituicao(escolha){
//     if(escolha.value == "nova"){
//         var botao = document.getElementById("novaInstituicao");
//         botao.click();
//     }else{
//         var selected = document.getElementById("instituicao");
//         selected.submit();
//     }
// }
function buscacep(){
    var cep= document.getElementById("cep")
    var estado = document.getElementsByName("estado")
    var cidade = document.getElementsByName("cidade")
    var rua = document.getElementsByName("rua")
    var numero = document.getElementsByName("numero")
    var confef = document.getElementsByName("fk_cd_confef")
    $('#exibeEndereco').text('');
    if(cep.value.length >= 8 && cep.value.length <= 9){
        axios.get('https://api.postmon.com.br/v1/cep/'+cep.value)
        .then(function(response){
            console.log(response.data)
            $("#exibeEndereco").text(response.data.logradouro+", n°"+", "+response.data.bairro+", "+response.data.cidade+"-"+response.data.estado)
            // var conteudoNovo = document.createTextNode("Estado: "+response.data.estado+" Cidade: "+response.data.cidade+" Bairro: "+response.data.bairro+ " Logradouro: "+response.data.logradouro);
            // div.appendChild(conteudoNovo); 
            rua[0].value = response.data.logradouro
            estado[0].value = response.data.estado
            cidade[0].value = response.data.cidade
        })
        .catch(function(err){
            console.log(err)
            $("#exibeEndereco").text("CEP não encontrado")
            rua[0].value = null;
            estado[0].value = null;
            cidade[0].value = null;
        })   
    }
}

var alunos;
$(document).ready(function(){
function buscarAlunos(){
    axios.post('/professor/turma/buscarAlunos', {idTurma : $('#id_turma').val()})
    .then(function(response){
        console.log(response)
        console.log($('#id_turma').val())
        alunos = response.data
        $('.conteudo').text('')
        for(aluno of alunos){
            let src = undefined;
            if(aluno.id_imagem == null){
                src = "../../img/student-girl.png"
            }else{
                src="../../img/avatar/"+aluno.id_imagem
            }
            const img = $('<img src="'+src+'">')
            const nome = $('<p></p>').text(aluno.nm_aluno)
            const imagem = $('<div class="imagem"></div>')
            id = aluno.id+"."+$('#id_turma').val()
            const ancora = $('<a class="aluno" href="/professor/turma/aluno?id='+id+'">')
            imagem.append(img)
            ancora.append(imagem, nome)
            $('.conteudo').append(ancora)
        }
    })
}
buscarAlunos()
$("#txtBusca").keyup(function(){
    var texto = $(this).val();
    $(".aluno").each(function(){
        if($(this).text().indexOf(texto) < 0){
            $(this).css("display", "none");
        }else{
            $(this).css("display", "flex");
        }
           
    });
});

{/* <a class="aluno" href="/professor/turma/aluno?aluno_id=<%=aluno.id%>">
                                    <div class="imagem">
                                        <%if(aluno.id_imagem  != null){%>
                                          <img src="../../img/avatar/<%=aluno.id_imagem%>">
                                          <%}else{%>
                                          <img src="../../img/student-girl.png">
                                          <%}%>
                                    </div>
                                    <p><%=aluno.nm_aluno%></p>
                            </a> */}


    $('#cadastrarAluno').click(function(){
    var esportes = new Array();
        $('*input[name=nm_esporte]').each(function(){
            esportes.push($(this).val());
        })
    var problemas = new Array();
        $('*input[name=nm_problema]').each(function(){
            problemas.push($(this).val());
        })
    let bodyFormData = new FormData();
    bodyFormData.set('nm_aluno', $('input[name=nm_aluno]').val())
    bodyFormData.set('matricula', $('input[name=matricula]').val())
    bodyFormData.set('dt_nascimento', $('input[name=dt_nascimento]').val())
    bodyFormData.set('id_turma', $('input[name=id_turma]').val())
    bodyFormData.set('nm_esporte', esportes)
    bodyFormData.set('nm_problema', problemas)
    bodyFormData.append("imagem", $("#imagem").prop("files")[0])
    console.log($("#imagem").prop("files")[0])
    axios({
        method: 'post',
        url: '/professor/turma/inserirAluno',
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then(function (response) {
            $('input[name=nm_aluno]').val('')
            $('input[name=matricula]').val('')
            $('input[name=dt_nascimento]').val('')
            $('#listaProblemaSaude').text('');
            $('#listaEsporte').text('');
            $('#textoEsporte').text('');
            $('#textoProblema').text('');
            $("#imagem").val('')

            if(response.data[0]=="E"){
                $('.alert-danger').attr('style', 'visibility: visible')
                $('.alert-danger').text(response.data)
            }else{
                $('#closeModalAluno').click()
                $('.alert-success').attr('style', 'visibility: visible')
                $('.alert-success').text(response.data)
                buscarAlunos()
            }
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
    })


})

var contaEsporte = 0;
$(document).ready(function(){
    $('#cadastraEsporte').click(function(){
        var nome = $('#esporte').val();
        var text = $('<p></p>').text("nome do esporte: "+nome);
        var excluir = $('<div class="close" style="color: red" onclick="removerEsporte('+contaEsporte+')">x</div>');
        text.append(excluir)
        var textoEsporte = $('<div id="esporte'+contaEsporte+'"></div>').append(text);
        var inputNome = $('<input type="text" value="'+nome+'" name="nm_esporte" hidden>');
        var esporte = $('<div id="esporte'+contaEsporte+'"></div>').append(inputNome);
        $('#textoEsporte').append(textoEsporte);
        $('#listaEsporte').append(esporte);
        contaEsporte++;
    })
})
var contaProblema = 0;
$(document).ready(function(){
    $('#cadastraProblema').click(function(){
        var nome = $('#problema').val();
        var text = $('<p></p>').text("nome do problema: "+nome);
        var excluir = $('<div class="close"  style="color: red" onclick="removerProblema('+contaProblema+')">x</div>');
        text.append(excluir)
        var textoProblema = $('<div id="problema'+contaProblema+'"></div>').append(text);
        var inputNome = $('<input type="text" value="'+nome+'" name="nm_problema" hidden>');
        var problema = $('<div id="problema'+contaProblema+'"></div>').append(inputNome);
        $('#textoProblema').append(textoProblema);
        $('#listaProblemaSaude').append(problema);
        contaProblema++;
    })
})
function removerEsporte(numero){
    $('*#esporte'+numero).remove();
}
function removerProblema(numero){
    $('*#problema'+numero).remove();
}

$(document).ready(function(){
    $('#botaoExistente').click(function(){
        if($('#alunoExistente').attr('style') == "visibility: hidden"){
            $('#alunoExistente').attr('style', 'visibility: visible')
            return
        }
        if($('#alunoExistente').attr('style') == "visibility: visible"){
            $('#alunoExistente').attr('style', 'visibility: hidden')
            return
        }
    })
    $('#botaoNovo').click(function(){
        if($('#alunoNovo').attr('style') == "visibility: hidden"){
            $('#alunoNovo').attr('style', 'visibility: visible')
            return
        }
        if($('#alunoNovo').attr('style') == "visibility: visible"){
            $('#alunoNovo').attr('style', 'visibility: hidden')
            return
        }
    })

    $('#procurarAluno').click(function(){
        axios.post('/professor/turma/pesquisarAlunos', {busca : $('#campoProcurarAluno').val(), idInstituicao : $('#idInsituicao').val(), idTurma : $('#idTurma').val()}
            )
            .then(function(response){
                console.log(response)
                $("#alunoResultados").text('').attr('style', 'visibility: visible')
                for(aluno of response.data){
                   $("#alunoResultados").append($('<option>').text(aluno.nm_aluno+" - "+aluno.matricula).val(aluno.id))
                }
            })
    })
    $('#cadastraAlunoTurma').click(function(){
        axios.post('/professor/inserirTurmaAluno', {idAluno : $('#alunoResultados').val(), idTurma : $('#idTurma').val()}
            )
            .then(function(response){
                console.log(response)
            })
    })
})

