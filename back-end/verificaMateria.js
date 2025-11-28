const botoesLinks = document.querySelectorAll(".btno")
//verifica qual matéria foi escolhido e mostra no console(nao tem necessidade)
botoesLinks.forEach(botao => {
    botao.addEventListener("click", function(event){
        const botaoClicado = event.target.title;
        localStorage.setItem("materiaEscolhida", botaoClicado);
        console.log("Você clicou na matéria:", botaoClicado);
    })
})