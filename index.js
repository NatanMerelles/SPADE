/*
Nesse documento é iniciado o servidor na porta 3000
- instanciar modulo server
- iniciar atravez do listen a porta 3000
*/
const app = require('./config/server')

app.listen(8080, ()=>{
    console.log('servidor online')
})