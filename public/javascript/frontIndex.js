// public/javascript/frontIndex.js

document.addEventListener("DOMContentLoaded", () => {
    const btnAddNota = document.getElementById("add-nota");
    const containerNotas = document.getElementById("notas");
    const createForm = document.getElementById("create-subject-form");
    const meuModal = document.getElementById("meuModal");

    if (meuModal) {
        meuModal.addEventListener('show', () => { document.body.style.overflow = 'hidden'; });
        meuModal.addEventListener('close', () => { document.body.style.overflow = 'auto'; });
    }

    function reordenarLegendas() {
        const fieldsets = containerNotas.querySelectorAll("fieldset");
        fieldsets.forEach((fs, index) => {
            const legenda = fs.querySelector("legend");
            const btnRemove = fs.querySelector(".remove-nota");
            legenda.innerHTML = `Avaliação ${index + 1} `;
            if (btnRemove) legenda.appendChild(btnRemove);
        });
    }

    if (btnAddNota) {
        btnAddNota.addEventListener("click", () => {
            const proximoNum = containerNotas.querySelectorAll("fieldset").length + 1;
            const novoFieldset = document.createElement("fieldset");
            novoFieldset.className = "border p-3 mb-3 rounded border-secondary position-relative";
            
            novoFieldset.innerHTML = `
                <legend class="float-none w-auto px-2 fs-6 text-info d-flex justify-content-between align-items-center w-100">
                    Avaliação ${proximoNum}
                    <button type="button" class="btn-close btn-close-white btn-sm remove-nota"></button>
                </legend>
                <div class="row g-2">
                    <div class="col-8">
                        <input type="text" class="form-control bg-dark text-white border-secondary" name="assessmentName" placeholder="Nome" required>
                    </div>
                    <div class="col-4">
                        <input type="number" class="form-control bg-dark text-white border-secondary" name="assessmentWeight" step="0.1" min="0" max="1" placeholder="Peso" required>
                    </div>
                </div>
            `;
            containerNotas.appendChild(novoFieldset);
            novoFieldset.querySelector(".remove-nota").addEventListener("click", () => {
                novoFieldset.remove();
                reordenarLegendas();
            });
            meuModal.scrollTop = meuModal.scrollHeight;
        });
    }

    if (createForm) {
        createForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const weights = document.getElementsByName("assessmentWeight");
            let somaPesos = 0;
            for (let i = 0; i < weights.length; i++) somaPesos += parseFloat(weights[i].value || 0);

            if (Math.abs(somaPesos - 1.0) > 0.0001) {
                alert(`❌ A soma dos pesos deve ser 1.0 (100%). Atual: ${somaPesos.toFixed(2)}`);
                return;
            }

            const materiaData = {
                name: document.getElementById("inputName").value,
                passGrade: parseFloat(document.getElementById("inputPassGrade").value), // Nova nota mínima
                image: document.getElementById("inputImage").value,
                assessments: Array.from(document.getElementsByName("assessmentName")).map((n, i) => ({
                    name: n.value,
                    weight: parseFloat(weights[i].value),
                    grade: 0
                }))
            };

            try {
                const response = await window.fetchProtected(`${API_BASE_URL}/materia`, {
                    method: 'POST',
                    body: JSON.stringify(materiaData)
                });
                if (response.ok) { alert("✅ Matéria criada!"); location.reload(); }
            } catch (err) { alert("🚨 Erro de conexão."); }
        });
    }
});