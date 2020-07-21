
$(document).ready(function(){
    $('#selectInstituicao').change(function(){
        if(this.value == "nova"){
            $('#novaInstituicao').click();
        }else{
            $('#instituicao').submit();
        }
    })
})

$(document).ready(function(){
    $('#modelo').change(function(){
        $('#listaAvaliacoes').html('')
        var model = JSON.parse($('#modelo').val());
        var exercicios = model.exercicios
        for(var i = 0; i < exercicios.length; i++){
            var min;
            var max;
            if(exercicios[i].ruim <= exercicios[i].bom){
                min = exercicios[i].ruim
                max = exercicios[i].bom
            }else{
                min = exercicios[i].bom
                max = exercicios[i].ruim
            }
            var listagem = $('<p style="margin-left: 10%;"></p>').text('Nome Exercicio: '+exercicios[i].nm_exercicio+' valor bom: '+exercicios[i].bom+' valor ruim: '+exercicios[i].ruim)
            var aux1 = $('<div class="col-md-5"></div>')
            var input = $('<input type="number" class="form-control col-md-2" name="resultado" value="" min="'+min+'" max="'+max+'">')
            var aux2 = $('<div class="col-md-5"></div>')
            var inputID = $('<input type="number" name="fk_id_exercicio" hidden>').val(exercicios[i].id)
            $('#listaAvaliacoes').append(listagem, aux1, input, aux2, inputID)
            $("#novaAvaliacao").attr('style', 'visibility: visible')
        }
        $('#avaliar').append($('<input type="text" name="nm_modelo" hidden>').val(model.nm_modelo))
        $("#novaAvaliacao").attr('style', 'visibility: visible')
        $("#labelDataAv").attr('style', 'visibility: visible')
        $("#data_avaliacao").attr('style', 'visibility: visible')
        $("#id_modelo").val(model.id)
    })
})

$(document).ready(function(){
    $('#selectAvaliacao').change(function(){
        
        $("#listagemExercicio").attr('style', 'visibility: visible')
        $("#dadosAvaliacao").attr('style', 'visibility: visible')
        $("#editarAvaliacao").attr('style', 'visibility: visible')
        var avaliacao = JSON.parse($('#selectAvaliacao').val());
        $('#resultadosEditar').text('')
        $('#listagemExercicio').html('')
        $('#dataAvaliacao').html("Data da avaliacao: "+avaliacao.dt_avaliacao.split("T")[0])
        var i = 0;
        $('#nm_editarAvaliacao').val(avaliacao.nm_modelo)
        $('#nm_editarAvaliacao').attr("id", avaliacao.id)
        for(var resultado of avaliacao.resultado){
            i++
            const divExercicio = $('<div class="exercicio"></div>')
            const divNome = $('<div class="nome"></div>').text("Nome do exercicio: "+resultado.nm_exercicio)
            const divResultado = $('<div class="resultado"></div>')
            const divConteudoResultado = $('<div class="conteudo"></div>').text("Resultado: "+resultado.valor)
            const divConteudoSlider = $('<div class="conteudo"></div>')
            const divSlider = $('<div id="slider'+i+'" class="slider"></div>')
            const divConteudoDesempenho = $('<div class="conteudo"></div>')
            divConteudoSlider.append(divSlider)
            divResultado.append(divConteudoResultado)
            divResultado.append(divConteudoSlider)
            divResultado.append(divConteudoDesempenho)
            divExercicio.append(divNome);
            divExercicio.append(divResultado);
            $('#listagemExercicio').append(divExercicio);
            let max=0;
            let min=0;
            let valor=0;
            if(resultado.ruim > resultado.bom){
                max = resultado.ruim
                min = resultado.bom
                valor = (max+min) - resultado.valor
            }else{
                max = resultado.bom
                min = resultado.ruim
                valor = resultado.valor
            }
            console.log(max, min)
            $j("#slider"+i).roundSlider({
                radius: 45,
                width: 10,
                handleSize: "+1",
                sliderType: "minRange",
                value: valor,
                min: min,
                max: max,
                readOnly: true
            });
            
            setTimeout(function(){ 
            }, 3000);

            var listagem = $('<p style="margin-left: 10%;"></p>').text('Resultado atual: '+resultado.valor+' valor bom: '+max+' valor ruim: '+min)
            var aux1 = $('<div class="col-md-5"></div>')
            const inputEditar = $('<input type="number" class="form-control col-md-2" name="valor_editar" min="'+min+'" max="'+max+'" value="'+resultado.valor+'"></input>')
            var aux2 = $('<div class="col-md-5"></div>')
            const idEditar = $('<input type="number" name="id_resultadoEditar" value="'+resultado.id+'" hidden></input>')
            $('#resultadosEditar').append(listagem, aux1, inputEditar, aux2, idEditar)
        }
    })
})

function buscacep(){
    var cep= document.getElementById("cep")
    var estado = document.getElementsByName("estado")
    var cidade = document.getElementsByName("cidade")
    var rua = document.getElementsByName("rua")
    var numero = document.getElementsByName("numero")
    var confef = document.getElementsByName("fk_cd_confef")
    var div= document.getElementById("div1"); 
    div.innerHTML = '';
    if(cep.value.length >= 8 && cep.value.length <= 9){
        axios.get('https://api.postmon.com.br/v1/cep/'+cep.value)
        .then(function(response){
            console.log(response.data)
            $("#exibeEndereco").text(response.data.logradouro+", n°"+", "+response.data.bairro+", "+response.data.cidade+"-"+response.data.estado)
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
$(document).ready(function(){
    function buscarModelos(){
        axios.post('/professor/buscarModelos', {})
        .then(function(response){
            modelos = response.data
            $('#modelo').text('')
            const option = $('<option value=""></option>').text('Escolha o Modelo')
            $('#modelo').append(option)
            for(modelo of response.data){
                const option = $(`<option value=`+`'`+JSON.stringify(modelo, null, ' ')+`'`+`>`+`</option>`).text(modelo.nm_modelo)
                $('#modelo').append(option)
            }
            
        })
    }
    buscarModelos()
var avaliacoes;
    function buscarAvaliacoes(){
        axios.post('/professor/turma/aluno/buscarAvaliacoes', {aluno_id: $('#id_aluno').val()})
        .then(function(response){
            avaliacoes = response.data
            $('#selectAvaliacao').html('')
            const option = $('<option value=""></option>').text('Escolha a Avaliacao')
            $('#selectAvaliacao').append(option)
            for(avaliacao of avaliacoes){
                const option = $(`<option value=`+`'`+JSON.stringify(avaliacao, null, ' ')+`'`+`>`+`</option>`).text(avaliacao.nm_modelo)
                $('#selectAvaliacao').append(option)
            }
            
        })
    }
    buscarAvaliacoes()

    $('#novaAvaliacao').click(function(){
        var resultados = new Array();
        $('input[name=resultado]').each(function(){
            resultados.push($(this).val());
        })
        var idExercicio = new Array();
        $('input[name=fk_id_exercicio]').each(function(){
            idExercicio.push($(this).val());
        })
        axios.post(
            '/professor/turma/aluno/inserirAvaliacao',
            {resultado: resultados, fk_id_exercicio: idExercicio, fk_id_modelo: $('#id_modelo').val(), fk_id_aluno: $('#id_aluno').val(), dt_avaliacao: $('#data_avaliacao').val()}
        )
        .then(function(response){
            if(response.data[0]=="E"){
                $('.alert-danger').attr('style', 'visibility: visible')
                $('.alert-danger').text(response.data)
            }else{
                $('#closeModalAluno').click()
                $('.alert-success').attr('style', 'visibility: visible')
                $('.alert-success').text(response.data)
                buscarAvaliacoes()
            }
        })
    })

    $('#btn_editarAvaliacao').click(function(){
        
        var resultados = new Array();
        $('input[name=valor_editar]').each(function(){
            resultados.push($(this).val());
        })
        var idResultado = new Array();
        $('input[name=id_resultadoEditar]').each(function(){
            idResultado.push($(this).val());
        })
        $('#closeModalEditarAvaliacao').click()

        axios.post(
            '/professor/turma/aluno/editarAvaliacao',
            {resultado: resultados, fk_id_resultado: idResultado, fk_id_modelo: $('#nm_editarAvaliacao').attr("id")}
        )
        .then(function(response){
            buscarAvaliacoes()
            $("#listagemExercicio").attr('style', 'visibility: hidden')
            $("#dadosAvaliacao").attr('style', 'visibility: hidden')
            $("#editarAvaliacao").attr('style', 'visibility: hidden')
            
        })
    })
})  
// <!-- <%for(var i = 0; i < modelos.length; i++){%>
//     <option value="<%= JSON.stringify(modelos[i]) %>"><%=modelos[i].nm_modelo%></option>
// <%}%> -->





    // var avaliacao = JSON.parse(id.value);
    // var resultado = avaliacao.resultado;
    // var divAvaliacao = document.getElementById('listagemExercicio');
    // divAvaliacao.innerHTML = "";
    // var dataAvaliacao = document.getElementById('dataAvaliacao');
    // var data = avaliacao.dt_avaliacao;
    // data = data.split("T");
    // dataAvaliacao.innerText = "Data da avaliacao: "+data[0];
    // for(let i = 0; i < resultado.length; i++){
        

    //     var divExercicio = document.createElement('div');
    //     var classExercicio = document.createAttribute('class');
    //     classExercicio.value = "exercicio";
    //     divExercicio.setAttributeNode(classExercicio);
    //     var textNodeNome = document.createTextNode("Nome do exercicio: "+resultado[i].nm_exercicio)
    //     var divNome = document.createElement('div');
    //     var classNome = document.createAttribute('class');
    //     classNome.value = "nome";
    //     divNome.setAttributeNode(classNome);
    //     divNome.appendChild(textNodeNome);

    //     var divResultado = document.createElement('div');
    //     var classResultado = document.createAttribute('class');
    //     classResultado.value = "resultado";
    //     divResultado.setAttributeNode(classResultado);

    //     var textNodeResultado = document.createTextNode("Resultado: "+resultado[i].valor)
    //     var divConteudoResultado = document.createElement('div');
    //     var classConteudoResultado = document.createAttribute('class');
    //     classConteudoResultado.value = "conteudo";
    //     divConteudoResultado.setAttributeNode(classConteudoResultado);
    //     divConteudoResultado.appendChild(textNodeResultado);

    //     var divConteudoSlider = document.createElement('div');
    //     var classConteudoSlider = document.createAttribute('class');
    //     classConteudoSlider.value = "conteudo";
    //     divConteudoSlider.setAttributeNode(classConteudoSlider);
    //     var divSlider = document.createElement('div');
    //     var idSlider = document.createAttribute('id');
    //     idSlider.value = "slider"+i;
    //     var classSlider = document.createAttribute('class');
    //     classSlider.value = "slider";
    //     divSlider.setAttributeNode(idSlider)
    //     divSlider.setAttributeNode(classSlider)
    //     divConteudoSlider.appendChild(divSlider)

        
        

    //     var textNodeDesempenho = document.createTextNode("Desempenho: ")
    //     var divConteudoDesempenho = document.createElement('div');
    //     var classConteudoDesempenho = document.createAttribute('class');
    //     classConteudoDesempenho.value = "conteudo";
    //     divConteudoDesempenho.setAttributeNode(classConteudoDesempenho);
    //     divConteudoDesempenho.appendChild(textNodeDesempenho);

    //     divResultado.appendChild(divConteudoResultado)
    //     divResultado.appendChild(divConteudoSlider)
    //     divResultado.appendChild(divConteudoDesempenho)
    //     divExercicio.appendChild(divNome);
    //     divExercicio.appendChild(divResultado);
    //     divAvaliacao.appendChild(divExercicio);
    //     $j("#slider"+i).roundSlider({
    //         radius: 45,
    //         width: 10,
    //         handleSize: "+1",
    //         sliderType: "minRange",
    //         value: resultado[i].valor,
    //         min: resultado[i].ruim,
    //         max: resultado[i].bom,
    //         readOnly: true
    //     });
        
    //     setTimeout(function(){ 
    //     }, 3000);
        

        
        
        
    // }

