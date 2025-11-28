const materias = [
    {
        id: 1,
        nome: "Matemática Discreta",
        Imagem:"Matemática Discreta",
    },
    {
        id: 2,
        nome: "Estatística",
        Imagem:"Matemática Discreta",
    },
    {
        id: 3,
        nome: "Desenvolvimento Front-End",
        Imagem:"Matemática Discreta",
    },
    {
        id: 4,
        nome: "UX",
        Imagem:"Matemática Discreta",
    },
    {
        id: 5,
        nome:  "Legislação e Ética",
        Imagem:"Matemática Discreta",
    }
];

for (let i = 1; i <= materias.length; i++) {
    const materia = materias.find(materia => materia.id === i)
    console.log(materia.id)
    console.log(materia.nome)
}
function divMaterias(materias){
    const div = document.getElementById('main-index');
    for(let i = 1; i < materias.length; i++) {
        const materia = materias.find(materia => materia.id === i)
        const divMateria = document.createElement("div");
        divMateria.id = `materia-${materia.id}`;
        divMateria.className = `estilo-${materia.nome}`;
        divMateria.textContent = `${materia.nome}`;
        if (div) {
            div.appendChild(divMateria);
        }
    }
}

divMaterias(materias);




function divMaterias(materias) {
    const div = document.getElementById('main-index');
    for (let i = 1; i <= materias.length; i++) {
        for (const materia of materias) {
            const divMateria = document.createElement("div");
            divMateria.id = `materia-${materia.id}`
            divMateria.className = "materias"
            divMateria.textContent = `${materia.nome}`
            if (div){
                div.appendChild(divMateria);
                console.log("A div foi anexada com sucesso!");
            }
        }   
    }
}

divMaterias(materias);
