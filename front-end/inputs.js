notas = ["p1","p2","t1","t2"];
//cria e coloca div container
const container = document.getElementById("main");
const div = document.createElement("div");
container.appendChild(div);
div.id = "container";
div.className = "container"
//cria h1 com nome da materia
const materia = localStorage.getItem("materiaEscolhida");
const h1 = document.getElementById("container");
const nomeMateria = document.createElement("h1");
h1.appendChild(nomeMateria);
nomeMateria.textContent = `${materia}`;
//cria linha para separar titulo dos inputs
const hr = document.getElementById("container");
const linhaQuebra = document.createElement("hr");
hr.appendChild(linhaQuebra);
//cria e coloca div row
const row = document.getElementById("container");
const div2 = document.createElement("div");
row.appendChild(div2);
div2.className = "row";
div2.id = "inputs";
// looping para o input de cada nota
for (const i of notas) {
    //pega a div para colocar a div nota(input)
    const divColocarInputs = document.getElementById("inputs");
    //cria a div nota(input)
    const divNota = document.createElement("div");
    //coloca a div nota na div que queria colocar e define classe bootstrap
    divColocarInputs.appendChild(divNota);
    divNota.className = "col-6 mb-5";
    //cria e coloca label para input
    const label = document.createElement("label");
    divNota.appendChild(label);
    label.htmlFor = i;
    label.textContent = `${i}:`.toUpperCase();
    //cria e coloca input e atribui atributos
    const input = document.createElement("input");
    divNota.appendChild(input);
    input.type = "number";
    input.className = "form-control-sm";
    input.placeholder = "Nota:"
    if (i[0] === "p"){
        input.name = `${i[1]}ª prova`;
    }else{
        input.name = `${i[1]}º tabalho`;
    }
    input.id = i;
}
const botao = document.getElementById("container");
const botaoEnviar = document.createElement("button");
botao.appendChild(botaoEnviar);
botaoEnviar.type = "button"
botaoEnviar.className = "btn btn-outline-primary d-block mx-auto";
botaoEnviar.id = "botaoEnviar";
botaoEnviar.textContent = "Enviar";
const resultado = document.getElementById("container");
const p = document.createElement("p");
resultado.appendChild(p);
p.className = "";
p.id = "resultadoDisplay";