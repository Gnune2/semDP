# 🚀 SemDP

![Status Badge](http://img.shields.io/static/v1?label=STATUS&message=ONLINE&color=SUCCESS&style=for-the-badge) ![License](http://img.shields.io/static/v1?label=LICENSE&message=MIT&color=blue&style=for-the-badge) ![Made With Coffee](http://img.shields.io/static/v1?label=FEITO%20COM&message=CAFÉ%20&%20ÓDIO&color=brown&style=for-the-badge)

> **"Porque ninguém merece fazer regra de três no guardanapo para saber se passou."**

O **SemDP** é a ferramenta definitiva para o universitário moderno. Um sistema Fullstack para você gerenciar suas notas, calcular aquelas médias ponderadas complexas e, o mais importante: descobrir exatamente quanto falta para não pegar aquela Dependência (DP) marota.

---

## 📸 O Painel da Verdade (Screenshots)

*(Coloque aqui um print bem bonito do seu dashboard mostrando as notas)*

---

## ✨ O que dá pra fazer?

### 🔐 Área VIP (Autenticação)
* **Sem penetras:** Cadastro e Login blindados.
* **Segurança de Banco:** Usamos **JWT** (porque cookie é só o que a gente come no intervalo) e senhas criptografadas com **Bcrypt** (nem o admin sabe sua senha).

### 📚 Vida Acadêmica Organizada
* **Adeus Planilhas Feias:** Um dashboard limpo para ver todas as suas matérias.
* **Personalização:** Dê nome aos bois (ou às matérias) e escolha ícones.
* **Calculadora da Esperança:** Configure pesos diferentes para provas e trabalhos. O sistema faz a conta chata por você.
* **Tudo Salvo:** Seus dados moram no **MongoDB**. Pode fechar a aba que a nota não some.

---

## 🛠️ Tecnologias (O motor debaixo do capô)

Este projeto não é só um rostinho bonito. Tem código de gente grande rodando aqui:

| Área | Tech | Pra que serve? |
| :--- | :--- | :--- |
| **Cérebro (Backend)** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) | Onde a mágica acontece. |
| **Rotas** | ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB) | O guarda de trânsito das requisições. |
| **Memória (DB)** | ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white) | Banco NoSQL (porque a vida não é relacional). |
| **Tradutor (ORM)** | ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white) | Facilita a conversa com o banco de dados. |
| **Visual (Frontend)** | ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white) | A parte que você vê e clica. |
| **Estilo** | ![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=flat&logo=bootstrap&logoColor=white) | Pra deixar tudo responsivo e bonitão. |

---

## 🧩 Como os dados se relacionam?

Basicamente: Um **Aluno** sofre com várias **Matérias**, e cada Matéria tem várias **Avaliações** para testar a sanidade do Aluno.

```mermaid
erDiagram
    ALUNO ||--o{ MATERIA : "tenta passar em"
    MATERIA ||--o{ AVALIACAO : "tem"
    
    ALUNO {
        String id PK
        String email "Onde chega o boleto"
        String password "Hash ultra secreto"
        String studentName
    }
    MATERIA {
        String id PK
        String name "Ex: Cálculo I"
        String image "Ícone bonito"
        String studentId FK
    }
    AVALIACAO {
        String id PK
        String name "Ex: P1"
        Float grade "A nota (ai que dor)"
        Float weight "O peso na média"
        String subjectId FK
    }
