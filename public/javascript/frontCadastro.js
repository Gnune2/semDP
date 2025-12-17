// public/javascript/frontCadastro.js

// Link do servidor (usa a variável global definida no config.js)
const BACKEND_URL = `${API_BASE_URL}/cadastro`;

// Espera o HTML carregar para executar o código
document.addEventListener("DOMContentLoaded", () => {
    
    // Pega o formulário
    const cadastroForm = document.getElementById("cadastro-form");

    // Função assíncrona que executa quando o botão submit é clicado
    cadastroForm.addEventListener("submit", async(event) => {
        // Desabilita o recarregamento padrão da página
        event.preventDefault();

        // Cria o objeto FormData com os dados do formulário
        const formData = new FormData(cadastroForm);

        // --- CORREÇÃO AQUI ---
        // Agora os nomes batem com os atributos 'name' do seu HTML e com o Backend
        const studentData = {
            studentName: formData.get("studentName"), // Corrigido: antes era "nome"
            email: formData.get("email"),
            password: formData.get("password")        // Corrigido: antes era "senha"
        };

        // Seleciona o botão de submit para dar feedback visual
        const submitButton = cadastroForm.querySelector("button[type='submit']");
        
        // Feedback para o usuário
        submitButton.textContent = "A processar...";
        submitButton.disabled = true;

        try {
            // Envia dados para o servidor
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(studentData), // Transforma o objeto em JSON
            });

            // Recebe a resposta do servidor
            const result = await response.json();

            // Verifica se deu certo (Status 200-299)
            if (response.ok) {
                alert('✅ Sucesso! ' + result.message + "\nAgora faça o login");
                // Redireciona para a página de login
                window.location.href = '/public/pages/login.html'; // Verifique se este caminho está correto no seu servidor final
            } else {
                // Mostra o erro retornado pelo servidor (ex: "Email já utilizado")
                alert('❌ Erro no Cadastro: ' + (result.error || 'Ocorreu um erro desconhecido.'));
            }
        } catch (error) {
            // Erro de rede ou conexão recusada
            console.error('Erro de conexão ou requisição:', error);
            alert(`🚨 Falha ao conectar ao servidor. Verifique se o backend está rodando em: ${BACKEND_URL}`);
        } finally {
            // Restaura o botão, independentemente do sucesso ou falha
            submitButton.textContent = 'Cadastrar-se';
            submitButton.disabled = false;
        }
    });
});