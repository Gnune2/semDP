// public/javascript/materias.js

document.addEventListener("DOMContentLoaded", async () => {
    await carregarMaterias();
});

async function carregarMaterias() {
    const cardContainer = document.getElementById("materias");
    try {
        const response = await window.fetchProtected(`${API_BASE_URL}/materia`);
        if (!response.ok) throw new Error();
        const materias = await response.json();
        cardContainer.innerHTML = '';
        materias.forEach(materia => cardContainer.appendChild(criarCardMateria(materia)));
    } catch (e) { cardContainer.innerHTML = `<p class="text-danger">Erro ao carregar.</p>`; }
}

function criarCardMateria(materia) {
    const div = document.createElement("div");
    div.className = "col-12 col-md-5 col-xl-3 p-2 mb-4";
    div.id = `materia-${materia.id}`;
    const imagemSrc = materia.image || '/public/assets/materias/padrao.png';

    div.innerHTML = `
        <div class="card h-100 bg-dark border-secondary shadow materias-card" style="cursor: pointer;">
            <img src="${imagemSrc}" class="card-img-top p-3" style="height: 120px; object-fit: contain;">
            <div class="card-body text-center d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title text-white m-0">${materia.name}</h5>
                    <button class="btn btn-sm text-danger p-0 delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <p class="text-info small mb-0">Meta: ${materia.passGrade.toFixed(1)}</p>
                <button class="btn btn-primary w-100 mt-2">Ver Notas</button>
            </div>
        </div>
    `;

    div.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        eliminarMateria(materia.id);
    });

    div.querySelector(".card").addEventListener("click", () => abrirEdicaoNotas(materia));
    return div;
}

function abrirEdicaoNotas(materia) {
    const modal = document.getElementById('modalNotas');
    const container = document.getElementById('lista-notas-editar');
    document.getElementById('tituloMateriaNota').textContent = materia.name;
    container.innerHTML = '';

    materia.assessments.forEach((av) => {
        const d = document.createElement('div');
        d.className = 'mb-3 text-start';
        d.innerHTML = `
            <label class="form-label text-info small">${av.name} (Peso: ${av.weight})</label>
            <input type="number" class="form-control bg-dark text-white border-secondary nota-input" 
                   data-weight="${av.weight}" value="${av.grade || 0}" step="0.1" min="0" max="10">
        `;
        container.appendChild(d);
    });

    const inputs = container.querySelectorAll('.nota-input');
    inputs.forEach(i => i.addEventListener('input', () => calcularMediaRealTime(materia.passGrade)));
    
    calcularMediaRealTime(materia.passGrade);
    modal.showModal();

    document.getElementById('form-notas').onsubmit = async (e) => {
        e.preventDefault();
        const gradesData = Array.from(inputs).map((input, idx) => ({
            id: materia.assessments[idx].id,
            grade: parseFloat(input.value) || 0
        }));
        const res = await window.fetchProtected(`${API_BASE_URL}/materia/${materia.id}/notas`, {
            method: 'PATCH',
            body: JSON.stringify({ grades: gradesData })
        });
        if (res.ok) { alert("Salvo!"); location.reload(); }
    };
}

function calcularMediaRealTime(passGrade) {
    const inputs = document.querySelectorAll('.nota-input');
    let media = 0;
    inputs.forEach(i => media += (parseFloat(i.value) || 0) * parseFloat(i.dataset.weight));

    const display = document.getElementById('mediaCalculada');
    const status = document.getElementById('statusPassar');
    display.textContent = media.toFixed(2);
    
    if (media >= passGrade) {
        display.className = "text-success";
        status.innerHTML = `<span class="badge bg-success mt-2">Dentro da Meta! 🎉</span>`;
    } else {
        display.className = "text-danger";
        status.innerHTML = `<span class="badge bg-warning text-dark mt-2">Faltam ${(passGrade - media).toFixed(2)} para ${passGrade}</span>`;
    }
}

async function eliminarMateria(id) {
    if (confirm("Excluir?")) {
        const res = await window.fetchProtected(`${API_BASE_URL}/materia/${id}`, { method: 'DELETE' });
        if (res.ok) document.getElementById(`materia-${id}`).remove();
    }
}