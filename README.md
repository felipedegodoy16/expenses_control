# Controle de Gastos Residenciais

Sistema full-stack desenvolvido para o desafio técnico de controle de gastos residenciais. 

## 🛠 Tecnologias Utilizadas

- **Backend:** C# com .NET 8 (Web API)
- **Banco de Dados:** SQLite (com Entity Framework Core)
- **Frontend:** React com TypeScript e Vite
- **Estilização:** Tailwind CSS

## 📋 Funcionalidades Implementadas

- **Gestão de Pessoas:** Cadastro, listagem e deleção de pessoas (ao deletar uma pessoa, suas transações são deletadas em cascata).
- **Gestão de Transações:** Cadastro e listagem. Há a validação onde menores de 18 anos só podem registrar despesas, não receitas.
- **Consulta de Totais:** Dashboard agregador que consolida o total de receitas, despesas e saldo líquido por pessoa, além do total geral da residência.

---

## 🚀 Como Executar o Projeto

Certifique-se de ter instalado em sua máquina:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)

### 1. Backend (API)

Acesse a pasta do backend:
```bash
cd backend
```

O banco de dados SQLite já está configurado. Para garantir que as tabelas sejam criadas corretamente, rode as migrations (opcional caso já haja o arquivo `expenses.db`, mas recomendado na primeira execução):
```bash
dotnet ef database update
```
*(Caso não possua o `dotnet ef` instalado globalmente, instale com `dotnet tool install --global dotnet-ef`)*

Execute a aplicação:
```bash
dotnet run
```
A API iniciará, por padrão, em `http://localhost:5299` (verifique a porta no console caso seja diferente).

### 2. Frontend (React)

Em um novo terminal, acesse a pasta do frontend a partir da raiz do projeto:
```bash
cd frontend
```

Instale as dependências do projeto:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse o endereço informado no terminal (geralmente `http://localhost:5173`) no seu navegador.

---

## 🏗 Arquitetura e Decisões Técnicas

- **Persistência de Dados (SQLite):** O SQLite foi escolhido por ser um banco de dados em arquivo, eliminando a necessidade de instalar um SGBD na máquina do avaliador, mantendo os dados persistentes mesmo após fechar a aplicação (requisito cumprido).
- **Validação de Regras de Negócio:** Centralizadas nos *Controllers* (ex: bloqueio de receitas para menores de 18 anos).
- **Cascatamento de Deleção:** Configurado nativamente via Entity Framework (`ON DELETE CASCADE`), garantindo a integridade referencial ao excluir uma pessoa.
- **Commits Granulares:** O histórico do Git foi construído funcionalidade por funcionalidade, conforme exigido.

---

Desenvolvido para avaliação técnica.
