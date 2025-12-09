const main = document.getElementById("main");
const h1 = document.createElement("h1");
main.appendChild(h1);
h1.textContent = "Login";
h1.id = "tituloLoginCadastro";
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
divForm.id = "login-form"
//puxa o form do documento html
const form = document.querySelector("form");
//array para diferenciar se é senha o email
emailsenha = ["email", "senha"]
for (const i of emailsenha){
    //adiciona divs para inputs de login
    const divInput = document.createElement("div");
    form.appendChild(divInput);
    //nomeia classe e id para as divs dos inputs email e senha
    divInput.id = `div${i}`;
    //adiciona Label para email e senha
    const email = document.getElementById(`div${i}`);
    const label = document.createElement("label");
    email.appendChild(label);
    label.setAttribute("for",`${i}`);
    label.className = "form-label text-capitalize";
    label.textContent = `${i}:`;
    //adiciona input para email e senha
    const input = document.createElement("input");
    email.appendChild(input);
    if (i === "senha"){
        input.type = "password";
    }else{
        input.type = `${i}`;
    }
    input.className = "form-control m-auto";
    input.id = `${i}`;
    input.placeholder = `${i}`;
    input.name = `${i}`;
    if (i === "email") {
        input.setAttribute("autocomplete","email");
        divInput.className = "mb-3";
    }else{
        input.setAttribute("autocomplete","current-password");
        divInput.className = "mb-4";
    }
    input.setAttribute("required","")
}
//adiciona botão de login
    const buttonLogin = document.createElement("button");
    form.appendChild(buttonLogin);
    buttonLogin.type = "button";
    buttonLogin.className = "btn btn-primary";
    buttonLogin.id = "botaoLogin";
    buttonLogin.textContent = "Login";
    buttonLogin.type = "submit";
    //adiciona link para cadastro
    const linkCadastro = document.createElement("a");
    form.appendChild(linkCadastro);
    linkCadastro.href = "cadastro.html";
    linkCadastro.id = "linkCadastro";
    linkCadastro.className = "col-12 d-block text-center mt-3 link-secondary";
    linkCadastro.textContent = "Cadastrar-se";

//varre o forms pegando os dados e envia para o servidor para logar
BACKEND_URL = "http://localhost:3000/login"
//espera o html carregar para excutar o código seguinte
document.addEventListener("DOMContentLoaded", () => {
    //pega o formulário e atribui a uma variavel
    const cadastroForm = document.getElementById("login-form");
    //função assincrona (envia dados para o servidor) que executa quando o botão submit é clicado
    cadastroForm.addEventListener("submit", async(event) => {
        //desabilita a função padrão dos botões submit que faz a página recarregar
        event.preventDefault();
        // função FormData que varre os dados do formulário
        const formData = new FormData(cadastroForm);
        //array que guarda os dados necassários da variavel que armazenou os dados puxados pelo FormData
        const studentData = {
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
            alert('✅ Sucesso! ' + result.massage)
            // Redirecionar para a página de login após o cadastro
            window.location.href = '/front-end/html/index.html';
        }else{
            alert('❌ Erro no Login: ' + (result.error || 'Ocorreu um erro desconhecido.'));
        }
        } catch (error) {
            // erro na conexao
            console.error('Erro de conexão ou requisição:', error);
            alert('🚨 Falha ao conectar ao servidor. Verifique se o backend está a correr (http://localhost:3000).' );
        } finally {
            //Restaura o Botão, independentemente do sucesso ou falha
            submitButton.textContent = 'Cadastrar';
            submitButton.disabled = false;
        }
    })
})