
const express = require('express');

const path = require('path');

const app = express();
const port = 9000;

app.use(express.json());
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../', 'index.html'))); // o caminho para acessar os meu files 
app.get('/router/main.js', (req, res) => res.sendFile(path.join(__dirname, 'main.js')));
app.get('/public/style.css', (req, res) => res.sendFile(path.join(__dirname, '../public', 'style.css')));

app.listen(port, () => console.log(`server is running on port ${port} `));


