$(document).ready(function(){
    var avaliacoes;
    function buscarAvaliacoes(){
        axios.post('/professor/turma/aluno/buscarAvaliacoes', {aluno_id: $('#id_aluno').val()})
        .then(function(response){
            console.log(response.data)
            avaliacoes = response.data
            
            for(avaliacao of avaliacoes){
                const option = $('<option value='+JSON.stringify(avaliacao)+'></option>').text(avaliacao.nm_modelo)
                $('#selectAvaliacao').append(option)
            }
            
        })
    }
    buscarAvaliacoes()

    $('#modelo').change(function(){
        $('#listaAvaliacoes').html('')
        var modelo = JSON.parse($('#modelo').val());
        var exercicios = modelo.exercicios
        console.log(modelo)
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
            var listagem = $('<p></p>').text('Nome Exercicio: '+exercicios[i].nm_exercicio+' valor bom:'+exercicios[i].bom+' valor ruim: '+exercicios[i].ruim+' Unidade de medida: '+exercicios[i].nm_exercicio)
            var input = $('<input type="number" name="resultado" value="" min="'+min+'" max="'+max+'">')
            var inputID = $('<input type="number" name="fk_id_exercicio" hidden>').val(exercicios[i].id)
            $('#listaAvaliacoes').append(listagem, input, inputID)
            $("#novaAvaliacao").attr('style', 'visibility: visible')
        }
        $('#avaliar').append($('<input type="text" name="nm_modelo" hidden>').val(modelo.nm_modelo))
        $("#novaAvaliacao").attr('style', 'visibility: visible')
        $("#data_avaliacao").attr('style', 'visibility: visible')
        $("#id_modelo").val(modelo.id)
    })
})

$(document).ready(function(){
    $('#selectAvaliacao').change(function(){
        var avaliacao = JSON.parse($('#selectAvaliacao').val());
        $('#listagemExercicio').html('')
        $('#dataAvaliacao').html("Data da avaliacao: "+avaliacao.dt_avaliacao.split("T")[0])
        var i = 0;
        $('#nm_editarAvaliacao').val(avaliacao.nm_modelo)
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

            const inputEditar = $('<input type="number" name="valor" value="'+resultado.valor+'"></input>')
            const idEditar = $('<input type="number" name="resultado" value="'+resultado.id+'" hidden></input>')
            $('.resultadosEditar').append(inputEditar, idEditar)
        }
    })
})