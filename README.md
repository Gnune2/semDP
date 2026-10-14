# 🚀 SemDP

![Status Badge](http://img.shields.io/static/v1?label=STATUS&message=ONLINE&color=SUCCESS&style=for-the-badge) ![License](http://img.shields.io/static/v1?label=LICENSE&message=MIT&color=blue&style=for-the-badge) ![Made With Coffee](http://img.shields.io/static/v1?label=FEITO%20COM&message=CAFÉ%20&%20ÓDIO&color=brown&style=for-the-badge)

> **"Porque ninguém merece fazer regra de três no guardanapo para saber se passou."**

O **SemDP** é a ferramenta definitiva para o universitário moderno. Um sistema Fullstack para você gerenciar suas notas, calcular aquelas médias ponderadas complexas e, o mais importante: descobrir exatamente quanto falta para não pegar aquela Dependência (DP) marota.

---

## ✨ Novidades da Versão 2.0

### 🌐 Link (domínio) do Projeto
* O sistema está disponível online em: **[https://semdp.com.br](https://semdp.com.br)**.

### 👤 Perfil do Aluno & Estatísticas
* **Dashboard Pessoal:** Visualize seus dados de cadastro e acompanhe seu progresso acadêmico em um só lugar.
* **Contador de Matérias:** Veja em tempo real o total de disciplinas matriculadas e quantas já foram concluídas com sucesso.

### 🎨 Visual Dinâmico & Interativo
* **Cards Inteligentes:** As bordas das matérias mudam de cor (Verde, Amarelo ou Vermelho) baseadas na sua média atual.
* **Efeito de Confete:** Comemore suas vitórias! O sistema dispara confetes ao atingir a meta de aprovação no simulador.

### 🛠️ Melhorias Técnicas
* **Deploy na HostGator:** Estrutura otimizada para rodar em servidores de produção com suporte a `.htaccess` e Node.js via cPanel.
* **Rodapé Profissional:** Navegação facilitada com links externos para redes sociais abrindo em novas abas.

---

## 🛠️ Tecnologias (O motor debaixo do capô)

| Área | Tech | Pra que serve? |
| :--- | :--- | :--- |
| **Cérebro (Backend)** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) | Onde a mágica acontece. |
| **Rotas** | ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB) | O guarda de trânsito das requisições. |
| **Memória (DB)** | ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white) | Banco NoSQL para persistência de dados. |
| **Tradutor (ORM)** | ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white) | Facilita a comunicação entre o Node e o Banco. |
| **Build** | ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white) | Bundle de frontend rápido e otimizado. |

---

## 🧩 Como os dados se relacionam?

```mermaid
erDiagram
    ALUNO ||--o{ MATERIA : "gerencia"
    MATERIA ||--o{ AVALIACAO : "possui"
    
    ALUNO {
        String id PK
        String email "Login do estudante"
        String password "Hash Bcrypt"
        String studentName "Nome completo"
    }
    MATERIA {
        String id PK
        String name "Ex: Algoritmos"
        Float passGrade "Meta (Ex: 6.0)"
        String studentId FK
    }
    AVALIACAO {
        String id PK
        Float grade "Nota obtida"
        Float weight "Peso da avaliação"
        String subjectId FK
    }
```

## 📸Screenshots

Originais individuais no Drive privado; entre na conta autorizada para visualizar.

- [Screenshot 1 — abrir original no Drive](https://drive.google.com/file/d/1IFDmLD54te2TrZcD_SH_EBVGl17M1OFK/view)
- [Screenshot 2 — abrir original no Drive](https://drive.google.com/file/d/1-ixlUIRKgR7m0nZDBgpoOgspcGvKdHzc/view)
- [Screenshot 3 — abrir original no Drive](https://drive.google.com/file/d/1XGKRgQeJbCm4hWbdmjyvU1jY6NnrfEkv/view)
- [Screenshot 4 — abrir original no Drive](https://drive.google.com/file/d/1w7isT6cGRnupPx_r03OyW6l6FCd6nsFK/view)
- [Screenshot 5 — abrir original no Drive](https://drive.google.com/file/d/1O6GdzD9qb9yvDBsHSd5Ls17P5EA8TAOC/view)

---

**Desenvolvido por [Guilherme Nunes](https://github.com/seu-usuario).**

## Acervo no Google Drive

Os screenshots de documentação foram movidos para o Drive como originais individuais. [Abra o catálogo e as instruções de recuperação](acervo/CATALOGO.md), com os IDs, caminhos anteriores e verificação SHA-256.

`git pull --ff-only` atualiza os códigos e o catálogo; faça uma cópia externa dos screenshots antes do primeiro pull com esta migração se quiser mantê-los offline. Para enviar código, confira `git status`, faça o commit das fontes e use `git push`. Os anexos migrados são ignorados pelo Git e podem ser restaurados nos caminhos antigos com `acervo/migracao.py`.
