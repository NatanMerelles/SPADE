function ok(id){
    $("#id_aluno").val(id);
    $("#form_aluno").submit();
}
$(document).ready(function(){
    function buscarAlunos(){
        axios.post('/professor/turma/buscarAlunos', {idTurma : $('#id_turma').text()})
        .then(function(response){
            console.log(response)
            console.log($('#id_turma').text())
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
                const ancora = $('<a class="aluno" onclick=ok('+aluno.id+')>')
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
    })


})