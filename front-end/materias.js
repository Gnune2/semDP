const materias = [
    {
        id: 1,
        nome: "Matemática Discreta",
        imagem:"/assets/materias/matematicaDiscreta.png",
        pagina:"/front-end/materias/matematicaDiscreta.html"
    },
    {
        id: 2,
        nome: "Estatística",
        imagem:"/assets/materias/estatistica.png",
        pagina:"/front-end/materias/estatistica.html"
    },
    {
        id: 3,
        nome: "Desenvolvimento Front-End",
        imagem:"/assets/materias/desenvolvimentoFrontEnd.png",
        pagina:"/front-end/materias/desenvolvimentoFrontEnd.html"
    },
    {
        id: 4,
        nome: "UX",
        imagem:"/assets/materias/interfaceEExperienciaDoUsuario.png",
        pagina:"/front-end/materias/interfaceEExperienciaDoUsuario.html"
    },
    {
        id: 5,
        nome: "Legislação e Ética",
        imagem:"/assets/materias/legislacaoEEtica.png",
        pagina:"/front-end/materias/legislacaoEEtica.html"
    }
];


function divMaterias(materias) {
    
    for (const materia of materias) {
        // cria o card para receber a materia e da atributos a ela
        const card = document.getElementById('materias');
        const CardMateria = document.createElement("div");
        CardMateria.id = `materia-${materia.id}`;
        CardMateria.className = "materias col-12 col-md-5 col-xl-2 m-2 p-0 card h-100 d-flex flex-column";
        // envia o card para o documento html
        if (card){
            card.appendChild(CardMateria);
        }
        // recebe a imagem
        const cardImagem = document.getElementById(`materia-${materia.id}`);
        const imagem = document.createElement("img");
        imagem.src = `${materia.imagem}`;
        // manda imagem para o card no documento html
        if (cardImagem) {
            cardImagem.appendChild(imagem);
        }
        // cria a div corpo do card para o documento html
        const bodyCard = document.getElementById(`materia-${materia.id}`);
        const CardBodyMateria = document.createElement("div");
        CardBodyMateria.id = `body-${materia.id}`;
        CardBodyMateria.className = "card-body p-2 d-flex flex-column flex-grow-1 ";
        if (bodyCard) {
            bodyCard.appendChild(CardBodyMateria)
        }
        //nome da matéria
        const nome = document.getElementById(CardBodyMateria.id);
        const nomeMateria = document.createElement("h5");
        if(nome){
            nome.appendChild(nomeMateria)
        }
        nomeMateria.textContent = `${materia.nome}`;
        //botão que redireciona para a página da matéria escolhida
        const botao = document.getElementById(CardBodyMateria.id);
        const botaoLink = document.createElement("a");
        botaoLink.textContent = "Calcular Média"
        botaoLink.className = "btn btn-outline-primary btn-sm mt-auto btno"
        botaoLink.id = `${materia.id}`
        botaoLink.setAttribute("title",`${materia.nome}`);
        botaoLink.href = "/front-end/calculomedia.html"
        if (botao){
            botao.appendChild(botaoLink);
        }
    }   
}
divMaterias(materias);



