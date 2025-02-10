const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const express = require('express');
const bodyParser = require('body-parser');

class WhatsAppService {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        this.app = express();
        this.configureMiddleware();
        this.setupEventHandlers();
    }

    configureMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            this.qrCodeString = qr;
            qrcode.generate(qr, { small: true });
            console.log('QR Code gerado, faça o scan');
        });

        this.client.on('ready', () => console.log('Cliente WhatsApp autenticado!'));
        this.client.on('message', async (msg) => {
            console.log('Mensagem recebida:', msg.body);
            console.log(msg)
            await this.handleIncomingMessage(msg);
        });
        this.client.on('authenticated', () => console.log('Autenticação realizada com sucesso'));
        this.client.on('auth_failure', (msg) => console.error('Falha na autenticação', msg));
    }

    async handleIncomingMessage(msg) {
        try {
            if (msg.body.toLowerCase() === 'ping') {
                await msg.reply('pong');
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    }

    async sendMessage(number, message) {
        const chatId = `${number}@c.us`;
        await this.client.sendMessage(chatId, message);
    }

    initialize() {
        this.client.initialize();
    }

    getApp() {
        return this.app;
    }

    getClient() {
        return this.client;
    }
}

module.exports = WhatsAppService;
