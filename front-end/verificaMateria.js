const botoesLinks = document.querySelectorAll(".btno")
botoesLinks.forEach(botao => {
    botao.addEventListener("click", function(event){
        const botaoClicado = event.target.title;
        localStorage.setItem("materiaEscolhida", botaoClicado);
        console.log("Você clicou na matéria:", botaoClicado);
        
    })
})