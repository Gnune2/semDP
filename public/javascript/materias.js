// Função principal que busca os dados e desenha na tela
async function carregarMaterias() {
    try {
        // Agora usamos o fetchProtected direto!
        // Não precisa passar headers, ele resolve sozinho.
        const response = await window.fetchProtected('https://media-imt.onrender.com/cadastro/materia');

        if (!response.ok) {
            throw new Error('Falha ao buscar matérias');
        }

        const materiasDoBanco = await response.json();

        // Chama a função de desenhar os cards (mantemos a mesma de antes)
        cardMaterias(materiasDoBanco);

    } catch (error) {
        console.error("Erro no fluxo:", error);
        // O fetchProtected já trata o redirecionamento se for erro de token,
        // aqui tratamos outros erros (ex: servidor desligado)
    }
}

// ... (A função cardMaterias continua exatamente igual à anterior) ...

// Inicializa
document.addEventListener('DOMContentLoaded', carregarMaterias);

// Função de criação dos Cards (Adaptada para os dados do Banco)
function cardMaterias(materias) {
    const cardContainer = document.getElementById('materias');
    
    // Limpa o container antes de adicionar para não duplicar se chamar 2x
    if(cardContainer) cardContainer.innerHTML = ''; 

    // Usamos o index para a lógica da quebra de linha <hr>
    materias.forEach((materia, index) => {
        
        // --- Criação do Card ---
        const CardMateria = document.createElement("div");
        CardMateria.id = `materia-${materia.id}`;
        CardMateria.className = "materias col-12 col-md-5 col-xl-2 p-0 card d-flex flex-column mt-3 mb-5";
        
        if (cardContainer) {
            cardContainer.appendChild(CardMateria);
        }

        // --- Imagem ---
        // Se não tiver imagem no banco, usa uma padrão
        const imagemSrc = materia.image ? materia.image : '/assets/materias/padrao.png'; 
        
        const imagem = document.createElement("img");
        imagem.src = imagemSrc;
        imagem.className = "card-img-top"; // Classe bootstrap para imagem ficar bonita no card
        imagem.alt = `Imagem de ${materia.name}`;
        
        CardMateria.appendChild(imagem);

        // --- Corpo do Card ---
        const CardBodyMateria = document.createElement("div");
        CardBodyMateria.className = "card-body p-2 d-flex flex-column flex-grow-1";
        CardMateria.appendChild(CardBodyMateria);

        // --- Nome da Matéria (Ajustado para 'name' do banco) ---
        const nomeMateria = document.createElement("h5");
        nomeMateria.textContent = materia.name; // O banco retorna 'name', não 'nome'
        CardBodyMateria.appendChild(nomeMateria);

        // --- Botão ---
        const botaoLink = document.createElement("a");
        botaoLink.textContent = "Calcular Média";
        botaoLink.className = "btn btn-outline-primary btn-sm mt-auto btno";
        botaoLink.id = materia.id;
        botaoLink.setAttribute("title", materia.name);
        
        // IMPORTANTE: Passamos o ID via URL Parameter
        botaoLink.href = `/public/pages/calculoMedia.html?id=${materia.id}`;
        
        CardBodyMateria.appendChild(botaoLink);

        // --- Lógica de Quebra de Linha (HR) ---
        // Como o ID do banco agora é um texto longo (UUID), usamos o índice do array
        // Se o índice + 1 for par, coloca a linha
        if ((index + 1) % 2 === 0) {
            const linhaQuebra = document.createElement("hr");
            linhaQuebra.className = "hrcards";
            cardContainer.appendChild(linhaQuebra);
        }
    });
}

// Inicializa a busca quando a página carrega
document.addEventListener('DOMContentLoaded', carregarMaterias);