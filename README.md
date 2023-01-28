<h1 align="left">Bate Papo API 💬</h1>

###

<p align="left">Esta é uma API (Application Programming Interface) de uma aplicação desenvolvida inspirada no bate-papo UOL.</p>

###

### ⚙️ Funcionalidades

- Adicionar participantes pelo nome
- Retornar a lista de todos os participantes
- Enviar mensagem (do tipo pública ou privada)
- Retornar as mensagens
- Postar status
- Remover usuários inativos
- Sanitizar dados
- Deletar mensagem
- Editar mensagem

</br>

### 📄 Documentação da API

##### INSCREVER PARTICIPANTE:

```http
  POST /participants
```

- Body:

| Parâmetro  | Tipo     | Descrição                               |
| :--------- | :------- | :---------------------------------------|
| `name`     | `string` | `Nome do participante a ser cadastrado` |

--

##### RETORNAR LISTA DOS PARTICIPANTES:

```http
  GET /participants
```

--

##### POSTAR MENSAGEM:

```http
  POST /messages
```
- Body:

| Parâmetro  | Tipo     | Descrição                             |
| :--------- | :------- | :-------------------------------------|
| `to`       | `string` | `Usuário que irá receber mensagem   ` |
| `text`     | `string` | `Mensagem que será enviada`           |
| `type`     | `string` | `private_message ou message`          |


- Headers:

| Parâmetro  | Tipo     | Descrição                              |
| :----------| :------- | :--------------------------------------|
| `user`     | `string` | `Usuário que está enviando a mensagem` |

--

##### RETORNAR AS MENSAGENS:

```http
  GET /messages?limit=${QTD_MENSAGENS}
```
- Query String (parâmetro opcional):

| Parâmetro  | Tipo     | Descrição                                  |
| :----------| :------- | :------------------------------------------|
| `limit`    | `string` | `Quantidade de mensagens que deseja obter` |

--

##### POSTAR STATUS:

```http
  POST /status
```
- Headers:

| Parâmetro  | Tipo     | Descrição                                   |
| :----------| :------- | :-------------------------------------------|
| `user`     | `string` | `Nome do usuário a ser atualizado o status` |

--

##### DELETAR MENSAGEM:

```http
  DELETE /messages/${ID_MENSAGEM_QUE_SERÁ_DELETADA}
```

- Headers:

| Parâmetro  | Tipo     | Descrição                                       |
| :----------| :------- | :-----------------------------------------------|
| `user`     | `string` | `Nome do usuário que deseja deletar a mensagem` |

--

##### EDITAR MENSAGEM:

```http
  PUT /messages/${ID_MENSAGEM_QUE_SERÁ_EDITADA}
```
- Body:

| Parâmetro  | Tipo     | Descrição                             |
| :--------- | :------- | :-------------------------------------|
| `to`       | `string` | `Usuário que irá receber mensagem   ` |
| `text`     | `string` | `Mensagem que será enviada`           |
| `type`     | `string` | `private_message ou message`          |

- Headers:

| Parâmetro  | Tipo     | Descrição                                       |
| :----------| :------- | :-----------------------------------------------|
| `user`     | `string` | `Nome do usuário que deseja deletar a mensagem` |

--

</br>

### ▶️ Rodando a aplicação

1. Crie ou selecione uma pasta com o nome de sua preferência
2. Clone este repositório na pasta criada/selecionada:

```bash
 $ git clone https://github.com/brunnaserafina/bate-papo-uol-api.git
```
3. Instale suas depêndencias:

```bash
   npm i
```

4. Inicie a aplicação:

```bash
   npx nodemon src/app.js
```

</br>

### 🛠️ Tecnologias

 <img align="left" alt="node" height="30px" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
 <img align="left" alt="express" height="30px" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
 <img align="left" alt="express" height="30px" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" />

</br>
</br>

### 🙇🏻‍♀️ Autora

- Feito com ❤️ por [@brunnaserafina](https://www.github.com/brunnaserafina)

