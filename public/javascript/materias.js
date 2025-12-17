let metaAtingida = false;

document.addEventListener("DOMContentLoaded", async () => {
    await carregarMaterias();
});

async function carregarMaterias() {
    const cardContainer = document.getElementById("materias");
    const welcome = document.getElementById("welcome-state");
    try {
        const response = await window.fetchProtected(`${API_BASE_URL}/materia`);
        const materias = await response.json();
        
        cardContainer.innerHTML = '';
        if (materias.length === 0) {
            welcome.classList.remove('d-none');
        } else {
            welcome.classList.add('d-none');
            materias.forEach(m => cardContainer.appendChild(criarCardMateria(m)));
        }
    } catch (e) { cardContainer.innerHTML = "Erro de conexão."; }
}

function criarCardMateria(materia) {
    const div = document.createElement("div");
    div.className = "col-12 col-md-5 col-xl-3 p-2 mb-4";
    div.id = `materia-${materia.id}`;
    div.innerHTML = `
        <div class="card h-100 bg-dark border-secondary shadow">
            <div class="card-body text-center">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="text-white m-0">${materia.name}</h5>
                    <button class="btn btn-sm text-danger delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
                <p class="small text-info">Meta: ${materia.passGrade}</p>
                <button class="btn btn-primary btn-sm w-100 mt-2 btn-abrir">Ver Notas</button>
            </div>
        </div>
    `;

    div.querySelector(".delete-btn").onclick = (e) => {
        e.stopPropagation();
        eliminarMateria(materia.id);
    };
    div.querySelector(".btn-abrir").onclick = () => abrirEdicaoNotas(materia);
    return div;
}

async function eliminarMateria(id) {
    if (!confirm("Excluir matéria e notas?")) return;
    const res = await window.fetchProtected(`${API_BASE_URL}/materia/${id}`, { method: 'DELETE' });
    if (res.ok) document.getElementById(`materia-${id}`).remove();
    if (document.querySelectorAll('.card').length === 0) location.reload();
}

function abrirEdicaoNotas(materia) {
    const modal = document.getElementById('modalNotas');
    const container = document.getElementById('lista-notas-editar');
    const scroll = document.querySelector('.notas-scroll-area');
    
    metaAtingida = false;
    document.getElementById('tituloMateriaNota').textContent = materia.name;
    container.innerHTML = '';
    if (scroll) scroll.scrollTop = 0;

    materia.assessments.forEach((av) => {
        const d = document.createElement('div');
        d.className = 'mb-3 text-start';
        d.innerHTML = `
            <label class="small text-info">${av.name} (Peso: ${av.weight})</label>
            <input type="number" class="form-control bg-dark text-white nota-input" 
                   data-weight="${av.weight}" value="${av.grade || 0}" step="0.1">
        `;
        container.appendChild(d);
    });

    const inputs = container.querySelectorAll('.nota-input');
    inputs.forEach(i => i.oninput = () => calcularMediaRealTime(materia.passGrade));
    calcularMediaRealTime(materia.passGrade);
    modal.showModal();

    document.getElementById('form-notas').onsubmit = async (e) => {
        e.preventDefault();
        const grades = Array.from(inputs).map((input, idx) => ({
            id: materia.assessments[idx].id,
            grade: parseFloat(input.value) || 0
        }));
        await window.fetchProtected(`${API_BASE_URL}/materia/${materia.id}/notas`, {
            method: 'PATCH',
            body: JSON.stringify({ grades })
        });
        location.reload();
    };
}

function calcularMediaRealTime(passGrade) {
    const inputs = document.querySelectorAll('.nota-input');
    let media = 0;
    inputs.forEach(i => media += (parseFloat(i.value) || 0) * parseFloat(i.dataset.weight));
    
    const display = document.getElementById('mediaCalculada');
    display.textContent = media.toFixed(2);
    
    if (media >= passGrade) {
        display.className = "text-success";
        if (!metaAtingida) { confetti({ particleCount: 150, origin: { y: 0.6 } }); metaAtingida = true; }
        document.getElementById('statusPassar').innerHTML = "<span class='badge bg-success'>Aprovado! 🎉</span>";
    } else {
        display.className = "text-danger";
        metaAtingida = false;
        document.getElementById('statusPassar').innerHTML = `<span class='badge bg-warning text-dark'>Faltam ${(passGrade - media).toFixed(2)}</span>`;
    }
}

function criarCardMateria(materia) {
    const div = document.createElement("div");
    div.className = "col-12 col-md-5 col-xl-3 p-2 mb-4";
    div.id = `materia-${materia.id}`;
    
    // Cálculo da média atual para definir a cor da borda
    const mediaAtual = materia.assessments.reduce((acc, av) => acc + (av.grade * av.weight), 0);
    const passGrade = materia.passGrade;
    
    let classeBorda = "border-secondary"; // Padrão
    if (mediaAtual >= passGrade) {
        classeBorda = "card-passou";
    } else if (mediaAtual >= (passGrade * 0.8)) { // Se estiver a 80% da meta
        classeBorda = "card-atencao";
    } else if (mediaAtual > 0) {
        classeBorda = "card-perigo";
    }

    const imagemSrc = materia.image || '/public/assets/materias/padrao.png';

    div.innerHTML = `
        <div class="card h-100 bg-dark ${classeBorda} shadow materias-card" style="cursor: pointer;">
            <img src="${imagemSrc}" class="card-img-top p-3" style="height: 120px; object-fit: contain;">
            <div class="card-body text-center d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title text-white m-0">${materia.name}</h5>
                    <button class="btn btn-sm text-danger p-0 delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <div class="mb-2">
                    <small class="text-secondary d-block">Média Atual</small>
                    <span class="fs-4 fw-bold ${mediaAtual >= passGrade ? 'text-success' : 'text-danger'}">
                        ${mediaAtual.toFixed(2)}
                    </span>
                </div>
                <button class="btn btn-outline-light btn-sm w-100 mt-2">Ver Detalhes</button>
            </div>
        </div>
    `;

    // Eventos (Delete e Abrir Modal) continuam iguais...
    div.querySelector(".delete-btn").onclick = (e) => { e.stopPropagation(); eliminarMateria(materia.id); };
    div.onclick = () => abrirEdicaoNotas(materia);

    return div;
}