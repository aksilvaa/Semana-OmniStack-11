const express = require('express');
const cors = require('cors');
const routes = require('./routes');

/** Query Params: Parametros nomeados enviados na rota após o "?" (Usados em filtros e paginação) 
 * Route Params: Usados para identificar recursos -- Exemplo de troca de rota Ex: ":id"
 * Request Body: Corpo da Requisição .. utilizado na criação e  na alteração
*/

const app = express();

app.use(cors(
    //Usado em Produçaõ para definir de onde poderá ser as origens das requisições
    //Exemplo: http://meuapp.com.br
    // {
    //     origin:''
    // }
));
app.use(express.json());
app.use(routes);

app.listen(3333);