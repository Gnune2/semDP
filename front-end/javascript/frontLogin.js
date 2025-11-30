//adiciona nome para a página dependendo da escolha do usuário (login/cadastro)
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
    label.textContent = `${i}`;
    //adiciona input para email e senha
    const input = document.createElement("input");
    email.appendChild(input);
    input.type = `${i}`;
    input.className = "form-control m-auto";
    input.id = `${i}`;
    input.placeholder = `Seu ${i}`;
    if (i === "email") {
        input.setAttribute("autocomplete","email");
        divInput.className = "mb-3";
    }else{
        input.setAttribute("autocomplete","current-password");
        divInput.className = "mb-4";
    }
    
}
//adiciona botões de login
    const botao = document.createElement("button");
    form.appendChild(botao);
    botao.type = "button";
    botao.className = "btn btn-primary me-2";
    botao.id = "botaoLogin";
    botao.textContent = "Login";
//adiciona link para cadastro
    const linkCadastro = document.createElement("a");
    form.appendChild(linkCadastro);
    linkCadastro.href = "cadastro.html";
    linkCadastro.id = "botaoCadastro";
    linkCadastro.className = "btn btn-secondary";
    linkCadastro.textContent = "Cadastrar-se";

//funcao para botão botaoCadastro
const botaoCadastro = document.getElementById("botaoLogin");
function login(){
    alert("Função de login ainda não implementada.");
};
botaoCadastro.addEventListener("click", login);
    