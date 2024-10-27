import express, { Request, Response } from 'express';
import http from 'http';
import { Router } from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { initializeWhatsAppClient } from './whatsappClient';
import { Client } from 'whatsapp-web.js';


const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});


let clientWhatsApp: Client;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Roteador
const router = Router();

router.get('/auth', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Enviar o HTML
});


router.post('/sendMessage', async (req: Request, res: Response) => {
  try {
    const { toNumber, text } = req.body;
      clientWhatsApp.sendMessage(`${toNumber}@c.us`, text).then((response)=>{
        console.log(response)
        res.send('Mensagem enviada');
      })
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
  }
});

async function validParams(toNumber : string, text : string) : Promise<Boolean>{
  return new Promise(()=>{
    if (!clientWhatsApp || !toNumber || !text) {
      return false;
    }
  })
  
}

app.use('/', router);
server.listen(port, () => {
  clientWhatsApp = initializeWhatsAppClient(io);
  console.log(`Servidor rodando na porta ${port}`);
});