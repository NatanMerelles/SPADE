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
var modelos;
var turmas;
$(document).ready(function(){
    function buscarTurmas(){
        axios.post('professor/buscarTurmas', {fk_id_instituicao: $("#fk_id_instituicao").val(), fk_cd_professor: $("#fk_cd_professor").val()})
        .then(function(response){
            $('.turmas').text('')
            turmas = response.data
            for(turma of response.data){
                const nm_turma = $('<p class="infoTurma"></p>').text(turma.nm_turma)
                const chave_acesso = $('<p class="infoChave"></p>').text("Chave: "+turma.chave_acesso)
                const ancora = $('<a class="item" href="/professor/turma?id='+turma.id+'"'+'></a>')
                ancora.append(nm_turma, chave_acesso)
                $('.turmas').append(ancora)
                
            }
        })
    }
    buscarTurmas()
    function buscarModelos(){
        axios.post('professor/buscarModelos', {})
        .then(function(response){
            modelos = response.data
            $('.modelos').text('')
            for(modelo of response.data){
                const ancora = $('<a class="item" href="#" data-toggle="modal" data-target="#modalModelo"></a>').text(modelo.nm_modelo)
                $('.modelos').append(ancora)
            }
            
        })
    }
    buscarModelos()

    $('#cadastraTurma').click(function(){
        axios.post('professor/inserirTurma', { nm_turma: $("#nm_turma").val(), chave_acesso: $("#chave_acesso").val(), fk_id_instituicao: $("#fk_id_instituicao").val(), fk_cd_professor: $("#fk_cd_professor").val() })
          .then(function (response) {
            if(response.data.mensagem[0]=="E"){
                $('.alert-danger').attr('style', 'visibility: visible')
                $('.alert-danger').text(response.data.mensagem)
            }else{
                $('#closeModalTurma').click()
                $('.alert-success').attr('style', 'visibility: visible')
                $('.alert-success').text(response.data.mensagem)
                buscarTurmas()
            }
            
          })
          .catch(function (error) {
            console.log(error);
          });
    })

    $('#cadastraModelo').click(function(){
        var nomeExercicio = new Array();
        $('input[name=name_exercicio]').each(function(){
            nomeExercicio.push($(this).val());
        })
        var ruim = new Array();
        $('input[name=ruim]').each(function(){
            ruim.push($(this).val());
        })
        var bom = new Array();
        $('input[name=bom]').each(function(){
            bom.push($(this).val());
        })
        var uni_medida = new Array();
        $('input[name=uni_medida]').each(function(){
            uni_medida.push($(this).val());
        })
        axios.post('professor/inserirModelo', { id_professor: $("input[name=id_professor]").val(),nm_modelo: $("input[name=nm_modelo]").val(),nm_exercicio: nomeExercicio, ruim: ruim, bom: bom, unidade_medida: uni_medida })
          .then(function (response) {
            if(response.data[0]=="E"){
                $('.alert-danger').attr('style', 'visibility: visible')
                $('.alert-danger').text(response.data)
            }else{
                $('#closeModalTurma').click()
                $('.alert-success').attr('style', 'visibility: visible')
                $('.alert-success').text(response.data)
                buscarModelos()
            }
            
          })
          .catch(function (error) {
            console.log(error);
          });
    })
})

var contaExercicios = 0;
$(document).ready(function(){
    $('#testando').click(function(){
        var nome = $('#nm_exercicio').val();
        var ruim = $('#valor_ruim').val();
        var bom = $('#valor_bom').val();
        var unidMedida = $('#unidade_medida').val();
        var text = $('<p></p>').text("nome do exercicio: "+nome+" resultado ruim: "+ruim+" resultado bom:"+bom+" unidade de medida: "+unidMedida);
        var excluir = $('<div class="close" onclick="remover('+contaExercicios+')" id="remove" style="color: red">x</div>');
        var textoExercicio = $('<div id="exercicio'+contaExercicios+'"></div>').append(excluir, text);
        var inputNome = $('<input type="text" value="'+nome+'" name="name_exercicio" hidden>');
        var inputRuim = $('<input type="number" value="'+ruim+'" name="ruim" hidden>');
        var inputBom = $('<input type="number" value="'+bom+'" name="bom" hidden>');
        var inputUnidMedida = $('<input type="number" value="'+unidMedida+'" name="uni_medida" hidden>');
        var exercicio = $('<div id="exercicio'+contaExercicios+'"></div>').append(inputNome, inputRuim, inputBom, inputUnidMedida);
        $('#textoExercicios').append(textoExercicio);
        $('#listaExercicios').append(exercicio);
        contaExercicios++;
    })
})
function remover(numeroExercicio){
    $('*#exercicio'+numeroExercicio).remove();
}


$(document).ready(function(){
    $('#selectInstituicao').change(function(){
        if(this.value == "nova"){
            $('#novaInstituicao').click();
        }else{
            $('#instituicao').submit();
        }
    })
})


