document.addEventListener("DOMContentLoaded", async () => {
    const nomeExibicao = document.getElementById('perfil-nome');
    const emailExibicao = document.getElementById('perfil-email');

    try {
        // Chamada correta para a API no Render
        const resUser = await window.fetchProtected(`${API_BASE_URL}/perfil`);
        
        if (!resUser.ok) throw new Error("Erro no servidor");

        const user = await resUser.json();
        
        // Atualiza a interface com os dados reais
        if (nomeExibicao) nomeExibicao.textContent = user.name;
        if (emailExibicao) emailExibicao.textContent = user.email;

        await carregarEstatisticas();
    } catch (err) {
        console.error(err);
        if (nomeExibicao) nomeExibicao.textContent = "Erro ao carregar";
    }
});

async function carregarEstatisticas() {
    try {
        const res = await window.fetchProtected(`${API_BASE_URL}/materia`);
        const materias = await res.json();

        document.getElementById('stat-total').textContent = materias.length;
        
        const concluidas = materias.filter(m => {
            const media = m.assessments.reduce((acc, av) => acc + (av.grade * av.weight), 0);
            return media >= m.passGrade;
        }).length;

        document.getElementById('stat-concluidas').textContent = concluidas;
    } catch (e) { console.error(e); }
}