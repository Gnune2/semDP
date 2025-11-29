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
    divNota.className = "col-12 mb-4 d-flex align-items-center justify-content-center";
    //cria e coloca label para input
    const label = document.createElement("label");
    divNota.appendChild(label);
    label.htmlFor = i;
    label.textContent = `${i}:`.toUpperCase();
    //cria e coloca input e atribui atributos
    const input = document.createElement("input");
    divNota.appendChild(input);
    input.type = "number";
    input.className = "form-control m-2";
    input.placeholder = "0.0"
    input.min = "0";
    input.max = "10";
    input.step = "0.1";
    input.setAttribute("oninput","if(this.value > 10) this.value = 10; if(this.value < 0) this.value = 0;");
    if (i[0] === "p"){
        input.name = `${i[1]}ª prova`;
    }else{
        input.name = `${i[1]}º tabalho`;
    }
    input.id = i;
}
//botão para enviar os inputs para calcular a média
const botao = document.getElementById("container");
const botaoEnviar = document.createElement("button");
botao.appendChild(botaoEnviar);
botaoEnviar.type = "button"
botaoEnviar.className = "btn btn-outline-primary mt-2";
botaoEnviar.id = "botaoEnviar";
botaoEnviar.textContent = "Calcular Média";
// texto que mostra o resultado final
const resultado = document.getElementById("container");
const p = document.createElement("p");
resultado.appendChild(p);
p.className = "resultadoMedia fs-3 fw-bold mt-4";
p.id = "resultadoDisplay"
// atualiza nome da página
document.title = `${materia}`;

//melhora interação do scroll com o input
const inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    input.addEventListener('wheel', function(e) {
      e.preventDefault();
      const passo = 0.5; 
      let valorAtual = parseFloat(this.value) || 0;
      if (e.deltaY < 0) {
        this.value = Math.min(valorAtual + passo, 10).toFixed(1);
      } else {
        this.value = Math.max(valorAtual - passo, 0).toFixed(1);
      }
    });
  });