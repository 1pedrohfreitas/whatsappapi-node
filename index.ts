// import express, { Request, Response } from 'express';
// import http from 'http';
// import fileUpload from 'express-fileupload';
// import qrcode from 'qrcode';
// import { Client, LocalAuth } from 'whatsapp-web.js';
// import { Router } from 'express';
// import path from 'path';
// import { Server } from 'socket.io';

// // Porta do servidor
// const port = process.env.PORT || 8000;

// let qrCodeConnection = '';

// // Instância do Express
// const app = express();

// // Instanciar o cliente do WhatsApp
// const clientWhatsApp = new Client({
//   authStrategy: new LocalAuth({ clientId: 'dev-pedrohfreitas' }),
//   puppeteer: {
//     headless: true,
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-accelerated-2d-canvas',
//       '--no-first-run',
//       '--no-zygote',
//       '--single-process',
//       '--disable-gpu'
//     ]
//   }
// });

// // Criação do servidor HTTP
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: '*', methods: ['GET', 'POST'] },
// });
// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload({ debug: true }));

// // Definindo o roteador
// const router = Router();

// // Rota principal
// router.get('/', (req: Request, res: Response) => {
//   res.send('Rota principal!');
// });

// // Rota para autenticação que exibe o QR Code
// router.get('/auth', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html')); // Enviar o HTML
// });

// router.get('/teste', (req: Request, res: Response) => {
//   clientWhatsApp.sendMessage('5531994245892','Teste');
//   res.send('Mensagem enviada'); // Enviar o HTML
// });
// app.use('/', router);



// // Iniciando o servidor e a inicialização do WhatsApp Web
// server.listen(port, () => {
//   clientWhatsApp.initialize();

//   clientWhatsApp.on('qr', (qr) => {
//     console.log('QR RECEIVED', qr);
//     qrcode.toDataURL(qr, (err, url) => {
//       if (url) {
//         qrCodeConnection = url;
//         // Enviar o QR Code para os clientes conectados via WebSocket
//         io.emit('qrCode', qrCodeConnection);
//       }
//     });
//   });

//   clientWhatsApp.on('ready', () => {
//     console.log('WhatsApp Client is ready!');
//     // Enviar evento de cliente pronto
//     io.emit('ready', 'Dispositivo pronto!');
//   });

//   clientWhatsApp.on('authenticated', () => {
//     console.log('Autenticado');
//     io.emit('authenticated', 'Autenticado!');
//   });

//   clientWhatsApp.on('auth_failure', () => {
//     console.error('Falha na autenticação');
//     io.emit('auth_failure', 'Falha na autenticação');
//   });

//   clientWhatsApp.on('change_state', (state) => {
//     console.log('Status de conexão: ', state);
//   });

//   clientWhatsApp.on('disconnected', (reason) => {
//     console.log('Cliente desconectado', reason);
//     clientWhatsApp.initialize();
//     io.emit('disconnected', 'Cliente desconectado!');
//   });
  
//   console.log(`Servidor rodando na porta ${port}`);
// });

// // Classe para mensagens
// export class Message {
//   private client: Client;

//   constructor(client: Client) {
//     this.client = client;
//   }

//   sendTextMessage(phoneNumber: string, message: string): Promise<string> {
//     return this.client.sendMessage(phoneNumber, message)
//       .then(() => {
//         return 'REST_RESPONSE_SUCCESS';
//       })
//       .catch(() => {
//         return 'REST_RESPONSE_FAIL';
//       });
//   }
// }