// src/whatsappClient.ts
import qrcode from 'qrcode';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { Server } from 'socket.io';

let qrCodeConnection = '';

// Função para inicializar o cliente do WhatsApp
export function initializeWhatsAppClient(io: Server) {
  const clientWhatsApp = new Client({
    authStrategy: new LocalAuth({ clientId: 'dev-pedrohfreitas' }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    }
  });

  clientWhatsApp.initialize();

  clientWhatsApp.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      if (url) {
        qrCodeConnection = url;
        io.emit('qrCode', qrCodeConnection); // Enviar o QR Code para os clientes conectados via WebSocket
      }
    });
  });

  clientWhatsApp.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    io.emit('ready', 'Dispositivo pronto!');
  });

  clientWhatsApp.on('authenticated', () => {
    console.log('Autenticado');
    io.emit('authenticated', 'Autenticado!');
  });

  clientWhatsApp.on('message', async msg => {
    console.log(msg)
    io.emit('message', msg.body);
  });
  clientWhatsApp.on('auth_failure', () => {
    console.error('Falha na autenticação');
    io.emit('auth_failure', 'Falha na autenticação');
  });

  clientWhatsApp.on('change_state', (state) => {
    console.log('Status de conexão: ', state);
  });

  clientWhatsApp.on('disconnected', (reason) => {
    console.log('Cliente desconectado', reason);
    clientWhatsApp.initialize();
    io.emit('disconnected', 'Cliente desconectado!');
  });

  return clientWhatsApp;
}
