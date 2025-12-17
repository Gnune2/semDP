// public/javascript/frontIndex.js

document.addEventListener("DOMContentLoaded", () => {
    const btnAddNota = document.getElementById("add-nota");
    const containerNotas = document.getElementById("notas");
    const createForm = document.getElementById("create-subject-form");
    const meuModal = document.getElementById("meuModal");

    // 1. Controle de Scroll ao abrir/fechar o Modal
    if (meuModal) {
        meuModal.addEventListener('show', () => {
            document.body.style.overflow = 'hidden';
        });

        meuModal.addEventListener('close', () => {
            document.body.style.overflow = 'auto';
        });
    }

    // 2. Função para reordenar os números das legendas (Avaliação 1, 2, 3...)
    function reordenarLegendas() {
        const fieldsets = containerNotas.querySelectorAll("fieldset");
        fieldsets.forEach((fs, index) => {
            const legenda = fs.querySelector("legend");
            const btnRemove = fs.querySelector(".remove-nota");
            
            legenda.innerHTML = `Avaliação ${index + 1} `;
            if (btnRemove) {
                legenda.appendChild(btnRemove);
            }
        });
    }

    // 3. Adicionar novas notas dinamicamente
    if (btnAddNota) {
        btnAddNota.addEventListener("click", () => {
            const proximoNum = containerNotas.querySelectorAll("fieldset").length + 1;
            const novoFieldset = document.createElement("fieldset");
            novoFieldset.className = "border p-3 mb-3 rounded border-secondary position-relative";
            
            novoFieldset.innerHTML = `
                <legend class="float-none w-auto px-2 fs-6 text-info d-flex justify-content-between align-items-center w-100">
                    Avaliação ${proximoNum}
                    <button type="button" class="btn-close btn-close-white btn-sm remove-nota" aria-label="Remover"></button>
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

            // Evento para remover a nota recém-criada
            novoFieldset.querySelector(".remove-nota").addEventListener("click", () => {
                novoFieldset.remove();
                reordenarLegendas();
            });

            // Scroll automático para a nova nota dentro do modal
            meuModal.scrollTop = meuModal.scrollHeight;
        });
    }

    // 4. Envio do formulário com validação de pesos
    if (createForm) {
        createForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const weights = document.getElementsByName("assessmentWeight");
            let somaPesos = 0;

            // Calcula a soma total dos pesos
            for (let i = 0; i < weights.length; i++) {
                somaPesos += parseFloat(weights[i].value || 0);
            }

            // Validação da soma (precisa ser 1.0)
            if (Math.abs(somaPesos - 1.0) > 0.0001) {
                alert(`❌ A soma dos pesos deve ser exatamente 1.0 (100%).\nAtualmente está em: ${somaPesos.toFixed(2)}`);
                return;
            }

            // Coleta de dados
            const name = document.getElementById("inputName").value;
            const image = document.getElementById("inputImage").value;
            const names = document.getElementsByName("assessmentName");
            
            const assessments = [];
            for (let i = 0; i < names.length; i++) {
                assessments.push({
                    name: names[i].value,
                    weight: parseFloat(weights[i].value),
                    grade: 0 // Inicia com nota zero
                });
            }

            const materiaData = { name, image, assessments };

            try {
                // Envio protegido via Token
                const response = await window.fetchProtected(`${API_BASE_URL}/materia`, {
                    method: 'POST',
                    body: JSON.stringify(materiaData)
                });

                if (response.ok) {
                    alert("✅ Matéria criada com sucesso!");
                    meuModal.close();
                    location.reload(); 
                } else {
                    const result = await response.json();
                    alert("❌ Erro: " + (result.error || "Falha ao criar matéria"));
                }
            } catch (err) {
                console.error("Erro na requisição:", err);
                alert("🚨 Erro de conexão com o servidor.");
            }
        });
    }
    
    // Adiciona evento de remoção aos fieldsets que já vieram no HTML
    const botoesRemoverIniciais = containerNotas.querySelectorAll(".remove-nota");
    botoesRemoverIniciais.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.target.closest('fieldset').remove();
            reordenarLegendas();
        });
    });
});