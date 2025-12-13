const main = document.getElementById("main");
const h1 = document.createElement("h1");
main.appendChild(h1);
h1.textContent = "Cadastro";
//adiciona div container
const divContainer = document.createElement("div")
main.appendChild(divContainer);
divContainer.className = "container col-12 mt-5 d-flex justify-content-center";
divContainer.id = "container";
//adiciona form
const container = document.getElementById("container");
const divForm = document.createElement("form");
container.appendChild(divForm);
divForm.className = "login form-floating col-8 col-sm-7 col-md-4 col-xl-3 p-4";
divForm.id = "cadastro-form"
//puxa o form do documento html
const form = document.querySelector("form");
//array para diferenciar se é senha, nome, email...
emailsenha = ["nome", "email", "senha"]
for (const i of emailsenha){
    //adiciona divs para inputs de cadastro
    const divInput = document.createElement("div");
    form.appendChild(divInput);
    //nomeia classe e id para as divs dos inputs email e senha
    divInput.id = `div${i}`;
    //adiciona Label para email e senha
    const caixaParaInput = document.getElementById(divInput.id);
    const label = document.createElement("label");
    caixaParaInput.appendChild(label);
    label.setAttribute("for",`${i}`);
    label.className = "form-label text-capitalize";
    label.textContent = `${i}:`;
    //adiciona input para email, senha e nome
    const input = document.createElement("input");
    caixaParaInput.appendChild(input);
    input.className = "form-control m-auto";
    input.type = `${i}`;
    input.id = `${i}`;
    input.placeholder = `${i}`;
    input.name = `${i}`
    input.setAttribute("required","")
    if (i === "email") {
        divInput.className = "mb-3";
        input.setAttribute("autocomplete", "email")
    }else{
        divInput.className = "mb-4";
    }
    
}
//adiciona botao para cadastro
    const buttonCadastro = document.createElement("button");
    form.appendChild(buttonCadastro);
    buttonCadastro.id = "botaoCadastro";
    buttonCadastro.className = "btn btn-primary";
    buttonCadastro.textContent = "Cadastrar-se";
    buttonCadastro.type = "submit"

//adiciona link para login
    const linkLogin = document.createElement("a");
    form.appendChild(linkLogin);
    linkLogin.href = "login.html";
    linkLogin.className = "col-12 d-block text-center mt-3 link-secondary";
    linkLogin.id = "linkLogin";
    linkLogin.textContent = "Login";

// varre os dados inseridos pelo estudante e manda para o servidor
//link do servidor node express
const BACKEND_URL = "https://media-imt.onrender.com/cadastro";
//espera o html carregar para excutar o código seguinte
document.addEventListener("DOMContentLoaded", () => {
    //pega o formulário e atribui a uma variavel
    const cadastroForm = document.getElementById("cadastro-form");
    //função assincrona (envia dados para o servidor) que executa quando o botão submit é clicado
    cadastroForm.addEventListener("submit", async(event) => {
        //desabilita a função padrão dos botões submit que faz a página recarregar
        event.preventDefault();
        // função FormData que varre os dados do formulário
        const formData = new FormData(cadastroForm);
        //array que guarda os dados necassários da variavel que armazenou os dados puxados pelo FormData
        const studentData = {
            studentName: formData.get("nome"),
            email: formData.get("email"),
            password: formData.get("senha")
        }
        //variavel amarzena o botão submit
        const submitButton = cadastroForm.querySelector("button[type='submit']");
        //feedback para o usúario
        submitButton.textContent = "A processar...";
        //desabilita botao enquanto servidor processa as informações para para evitar bugs 
        submitButton.disabled = true;
        //envia dados para servidor
        try {
            //requisição dos dados na porta localhost:3000/cadastro
            const response = await fetch(BACKEND_URL,{
                //especifica o metodo usando na porta pq o padrão é get
                method:"POST",
                //explica que o tipó vai ser o json
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(studentData),// tranforma o array e json e envia no body
            });
            // recebe a reposta do servidor e armazena numa variavel
            const result = await response.json()
            //mostra a reposta para o cliente pelo front
            if (response.ok){
                //sim eu coloquei o emoji pra ficar mais legal
                alert('✅ Sucesso! ' + result.massage + "\nAgora faça o login")
                // Redirecionar para a página de login após o cadastro
                window.location.href = '/public/pages/login.html';
            }else{
                alert('❌ Erro no Cadastro: ' + (result.error || 'Ocorreu um erro desconhecido.'));
            }
        } catch (error) {
            // erro na conexao
            console.error('Erro de conexão ou requisição:', error);
            alert('🚨 Falha ao conectar ao servidor. Verifique se o backend está a correr (https://media-imt.onrender.com).' );
        } finally {
            //Restaura o Botão, independentemente do sucesso ou falha
            submitButton.textContent = 'Cadastrar';
            submitButton.disabled = false;
        }
    })
})