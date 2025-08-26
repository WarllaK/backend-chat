# API de Chat com Node.js

 #### Arquitetura do projeto combina os seguintes elementos:

* **API RESTful**: Para gerenciar o **CRUD** (Create, Read, Update, Delete) de usuários e mensagens, garantindo a persistência dos dados no banco.
* **Autenticação JWT**: Protege as rotas da API, assegurando que apenas usuários autenticados possam acessar e manipular dados.
* **WebSockets**: Utiliza um canal de comunicação bidirecional para o **envio de mensagens em tempo real**, proporcionando uma experiência de chat fluida e instantânea.
* **PostgreSQL e Prisma**: O banco de dados PostgreSQL, gerenciado pelo ORM Prisma, oferece uma solução robusta e tipada para o armazenamento eficiente de informações de usuários e mensagens.

A  API é construída com **Node.js** e **Express**, e pode ser executada facilmente usando o **Yarn** e o **Docker**, tornando o ambiente de desenvolvimento ágil e portátil.

## Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript.
* **Express**: Framework web para Node.js.
* **PostgreSQL**: Banco de dados relacional.
* **Prisma**: ORM moderno para interagir com o banco de dados.
* **WebSockets (lib `ws`)**: Para comunicação em tempo real entre os usuários.
* **JWT (JSON Web Tokens)**: Para autenticação e segurança das rotas.
* **Bcrypt**: Para criptografia de senhas.
* **Yarn**: Gerenciador de pacotes.

---

##  Pré-requisitos


* [Node.js](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)
* [PostgreSQL](https://www.postgresql.org/) ou [Docker](https://www.docker.com/)


---

##  Instalação e Configuração

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Instalar as Dependências

Usando o `yarn`, instale todas as dependências do projeto:

```bash
yarn install
```

##  Execução do Banco de Dados com Docker (Opcional)

Se você preferir não instalar o PostgreSQL localmente, pode usar o Docker para subir o banco de dados. Um arquivo `docker-compose.yml` está na raiz do projeto para facilitar esse processo.

1.  Certifique-se de que o Docker esteja em execução.
2.  No terminal, na raiz do projeto, execute o seguinte comando:

```bash
docker-compose up -d
```

###  Configurar o Banco de Dados

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias. Substitua os valores pelos seus dados de conexão do PostgreSQL e a chave secreta do JWT.

```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public"
JWT_SECRET=sua-chave-secreta-forte
```

### Migrar o Banco de Dados

Para criar as tabelas no seu banco de dados a partir do schema do Prisma, execute a migração:

```bash
npx prisma migrate dev --name init
```

### 5\. Iniciar o Servidor

```bash
yarn start
```

O servidor estará rodando em `http://localhost:3000`.
- se desejar mudar a porta do servidor é só adicionar a variavél `PORT` no `.env`

-----

## Rotas da API

### Rotas de Autenticação

| Método | Rota               | Descrição                 |
| ------ | ------------------ | ------------------------- |
| `POST` | `/api/users`       | **Cria** um novo usuário. |
| `POST` | `/api/login`       | Realiza o **login** do usuário e retorna um JWT. |

### Rotas de Usuário (CRUD)

| Método | Rota               | Descrição                        |
| ------ | ------------------ | -------------------------------- |
| `GET`  | `/api/users`       | **Lista** todos os usuários.     |
| `GET`  | `/api/users/:id`   | **Busca** um usuário por ID.     |
| `PUT`  | `/api/users/:id`   | **Atualiza** um usuário por ID.  |
| `DELETE`| `/api/users/:id`   | **Deleta** um usuário por ID.    |

  * **Observação**: As rotas de usuário, exceto a de criação, exigem autenticação. Inclua o token JWT no cabeçalho `Authorization: Bearer SEU_TOKEN`.

### Rotas de Mensagem

| Método | Rota               | Descrição                        |
| ------ | ------------------ | -------------------------------- |
| `POST` | `/api/messages`    | **Cria** uma nova mensagem.      |
| `GET`  | `/api/messages`    | **Lista** todas as mensagens.    |

-----

## WebSocket

A API também suporta comunicação em tempo real através de WebSockets.

  * **URL de Conexão**: `ws://localhost:3000`

### Como Enviar uma Mensagem

Envie mensagens em formato JSON para a conexão WebSocket. O servidor espera o seguinte formato:

```json
{
  "content": "Sua mensagem aqui.",
  "userId": 1
}
```

O servidor, por sua vez, retransmite a mensagem para todos os clientes conectados.

