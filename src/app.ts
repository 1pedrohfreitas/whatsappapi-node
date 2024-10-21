
import express, { Request, Response } from 'express';
import http from 'http';
import { Router } from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { initializeWhatsAppClient } from './whatsappClient';
import { Client } from 'whatsapp-web.js';

const port = process.env.PORT || 8000;

const { Pool } = require('pg');

// Criação de um pool de conexões
const connectionString = 'postgresql://postgres:Meudeus0@localhost:5432/whatsappapi?currentSchema=public';


const pool = new Pool({
  connectionString: connectionString,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL!");
    
    client.release();
    getMessages();
  } catch (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  }
}

// Instância do Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

let clientWhatsApp: Client

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload({ debug: true }));

// Roteador
const router = Router();

// Rota principal
router.get('/', (req: Request, res: Response) => {
  res.send('Rota principal!');
});

// Rota para autenticação que exibe o QR Code
router.get('/auth', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Enviar o HTML
});

// Rota de teste
router.get('/teste', (req: Request, res: Response) => {

  clientWhatsApp.sendMessage('553194245892@c.us', 'Teste').then(response => {
    res.send('Mensagem enviada');
  }).catch(err => {
    res.send('Mensagem não enviada');
  });

});

app.use('/', router);

async function getMessages() {
  try {
      const res = await pool.query('SELECT * FROM message');
      console.log(res.rows);
  } catch (err) {
      console.error('Erro ao executar a consulta:', err);
  }
}
// Iniciar o servidor
server.listen(port, () => {
  testConnection();
  // clientWhatsApp = initializeWhatsAppClient(io);
  console.log(`Servidor rodando na porta ${port}`);
}).close(() => {
  process.on('exit', () => {
    pool.end();
  });
});
