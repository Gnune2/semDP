// public/javascript/materias.js

document.addEventListener("DOMContentLoaded", async () => {
    await carregarMaterias();
});

async function carregarMaterias() {
    const cardContainer = document.getElementById("materias");
    
    try {
        // Busca as matérias do usuário logado usando o token de autenticação
        const response = await window.fetchProtected(`${API_BASE_URL}/materia`);
        
        if (!response.ok) throw new Error("Falha ao carregar matérias");
        
        const materias = await response.json();

        // Limpa apenas a área de cards, mantendo os títulos fixos do HTML
        if (cardContainer) cardContainer.innerHTML = '';

        materias.forEach(materia => {
            const card = criarCardMateria(materia);
            cardContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        if (cardContainer) {
            cardContainer.innerHTML = `<p class="text-danger">Erro ao carregar matérias. Verifique sua conexão.</p>`;
        }
    }
}

function criarCardMateria(materia) {
    const divCol = document.createElement("div");
    divCol.className = "col-12 col-md-5 col-xl-3 p-2 mb-4";
    divCol.id = `materia-${materia.id}`;

    // Define a imagem padrão caso não exista uma URL
    const imagemSrc = materia.image || '/public/assets/materias/padrao.png';

    divCol.innerHTML = `
        <div class="card h-100 bg-dark border-secondary shadow materias-card" style="cursor: pointer;">
            <img src="${imagemSrc}" class="card-img-top p-3" alt="${materia.name}" style="height: 150px; object-fit: contain;">
            <div class="card-body text-center d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title text-white m-0">${materia.name}</h5>
                    <button class="btn btn-sm text-danger p-0 delete-btn" title="Excluir Matéria">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <p class="card-text text-info small">Clique para ver as notas</p>
                <button class="btn btn-primary w-100 mt-2">Calcular Média</button>
            </div>
        </div>
    `;

    // Evento para excluir a matéria
    divCol.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // Impede de abrir o modal de notas ao clicar no lixo
        eliminarMateria(materia.id);
    });

    // Evento para abrir o modal de edição de notas
    divCol.querySelector(".card").addEventListener("click", () => {
        abrirEdicaoNotas(materia);
    });

    return divCol;
}

async function eliminarMateria(id) {
    if (!confirm("Deseja realmente excluir esta matéria e todas as suas notas?")) return;

    try {
        const response = await window.fetchProtected(`${API_BASE_URL}/materia/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            document.getElementById(`materia-${id}`).remove();
        } else {
            alert("Não foi possível excluir a matéria.");
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
}

function abrirEdicaoNotas(materia) {
    const modal = document.getElementById('modalNotas');
    const container = document.getElementById('lista-notas-editar');
    const titulo = document.getElementById('tituloMateriaNota');
    
    if (!modal || !container) return;

    titulo.textContent = materia.name;
    container.innerHTML = '';

    // Gera os inputs de nota baseado no que foi configurado no banco
    materia.assessments.forEach((av) => {
        const div = document.createElement('div');
        div.className = 'mb-3 text-start';
        div.innerHTML = `
            <label class="form-label text-info small">${av.name} (Peso: ${av.weight})</label>
            <input type="number" class="form-control bg-dark text-white border-secondary nota-input" 
                   data-weight="${av.weight}" 
                   value="${av.grade || 0}" 
                   step="0.1" min="0" max="10">
        `;
        container.appendChild(div);
    });

    // Escuta mudanças nos inputs para calcular a média em tempo real
    container.querySelectorAll('.nota-input').forEach(input => {
        input.addEventListener('input', calcularMediaRealTime);
    });

    calcularMediaRealTime();
    modal.showModal();

    // Configura o salvamento (Submit)
    document.getElementById('form-notas').onsubmit = async (e) => {
        e.preventDefault();
        alert("Lógica de salvamento disparada! (Próxima etapa: Criar rota de Update no Backend)");
        modal.close();
    };
}

function calcularMediaRealTime() {
    const inputs = document.querySelectorAll('.nota-input');
    let media = 0;
    
    inputs.forEach(input => {
        const nota = parseFloat(input.value) || 0;
        const peso = parseFloat(input.dataset.weight) || 0;
        media += nota * peso;
    });

    const displayMedia = document.getElementById('mediaCalculada');
    if (displayMedia) {
        displayMedia.textContent = media.toFixed(2);
        // Muda a cor baseado na nota (Ex: 6.0 é a média de aprovação)
        displayMedia.className = media >= 6 ? "text-success" : "text-danger";
    }
}