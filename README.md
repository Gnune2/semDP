# 🎓 Calculadora de Média Acadêmica (IMT)

![Status Badge](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=111D2B&style=for-the-badge) ![License](http://img.shields.io/static/v1?label=LICENSE&message=MIT&color=0c1014&style=for-the-badge)

Um sistema web Fullstack desenvolvido para auxiliar estudantes universitários no gerenciamento de notas e cálculo de médias ponderadas. O projeto permite a criação de contas, login seguro e personalização de matérias com pesos específicos para provas e trabalhos.

> **Nota:** Este projeto foi desenvolvido com foco educacional para aprofundamento em Node.js, API REST, manipulação de banco de dados NoSQL e autenticação JWT.

---

## 📸 Screenshots

*(Em breve: Imagens da tela de login e dashboard)*

---

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
* **Cadastro de Usuários:** Criação de conta com validação de email único.
* **Login Seguro:** Autenticação via **JWT (JSON Web Tokens)** para manter a sessão do usuário.
* **Criptografia:** Senhas armazenadas no banco de dados com hash utilizando **Bcrypt**.
* **Proteção de Rotas:** Middleware para garantir que apenas usuários logados acessem seus dados.

### 📚 Gerenciamento Acadêmico
* **Dashboard Pessoal:** Exibição exclusiva das matérias do aluno logado.
* **Gestão de Matérias:** Criação de disciplinas com nome e ícone personalizado.
* **Avaliações Flexíveis:** Configuração de provas e trabalhos com pesos diferentes (Média Ponderada).
* **Persistência de Dados:** Todas as informações são salvas no **MongoDB**.

---

## 🛠️ Tecnologias Utilizadas

O projeto segue uma arquitetura separando o Backend (API) do Frontend.

| Categoria | Tecnologia | Função |
| :--- | :--- | :--- |
| **Backend** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) | Ambiente de execução do servidor. |
| **Framework** | ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB) | Gerenciamento de rotas e API REST. |
| **Banco de Dados** | ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white) | Banco de dados NoSQL (Documentos). |
| **ORM** | ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white) | Abstração do banco de dados e tipagem. |
| **Frontend** | ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white) | Estrutura e Estilização. |
| **Estilização** | ![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=flat&logo=bootstrap&logoColor=white) | Framework CSS para responsividade e UI. |

---

## 🗂️ Estrutura do Banco de Dados

O projeto utiliza o **Prisma Schema** para modelar o relacionamento entre Alunos, Matérias e Avaliações.

```mermaid
erDiagram
    STUDENT ||--o{ SUBJECT : "cria"
    SUBJECT ||--o{ ASSESSMENT : "possui"
    
    STUDENT {
        String id PK
        String email
        String password
        String studentName
    }
    SUBJECT {
        String id PK
        String name
        String image
        String studentId FK
    }
    ASSESSMENT {
        String id PK
        String name
        Float grade
        Float weight
        String subjectId FK
    }
```
## 🚀 Como Rodar o Projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão 18 ou superior).
* [Git](https://git-scm.com).
* Um editor de código, como o [VSCode](https://code.visualstudio.com/).

### Passo a Passo

#### 1. Clone o repositório
```bash
git clone [https://github.com/SEU-USUARIO/media-imt.git](https://github.com/SEU-USUARIO/media-imt.git)
cd media-imt
```

#### 2. Instale as dependências
Este comando vai baixar todas as bibliotecas necessárias (Express, Prisma, etc.) listadas no package.json.
```bash
npm install
```

#### 3. Configure as Variáveis de Ambiente
Crie um arquivo chamado .env na raiz do projeto (onde fica o package.json). Abra esse arquivo e cole as seguintes configurações (substitua pelos seus dados reais do MongoDB):
```Snippet de código
# URL de conexão do MongoDB (Atlas ou Local)
DATABASE_URL="mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/NOME_DO_DB"

# Uma senha secreta para a segurança do Login (pode ser qualquer texto longo)
JWT_SECRET="escreva_aqui_uma_frase_muito_secreta"
```

#### 4. Configure o Banco de Dados (Prisma)
Este comando traduz o arquivo schema.prisma para que o JavaScript entenda seu banco de dados.
```bash
npx prisma generate
```

#### 5. Inicie o Servidor Backend
```bash
npm start
```
O terminal deve mostrar: Servidor inicializado com sucesso na porta 3000 e conectado ao mongoDB.

#### 6. Inicie o Frontend
Para evitar erros de segurança (CORS), não abra o HTML direto na pasta.

1. Abra o arquivo front-end/html/login.html no VSCode.

2. Use a extensão Live Server (clique com botão direito -> "Open with Live Server").

3. O projeto abrirá no seu navegador (geralmente em http://127.0.0.1:5500).
