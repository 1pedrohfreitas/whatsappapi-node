const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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
        this.setupRoutes();
    }

    configureMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        
        // Middleware de tratamento de erros
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
            console.log('QR Code gerado, faça o scan');
        });

        this.client.on('ready', () => {
            console.log('Cliente WhatsApp autenticado!');
        });

        this.client.on('message', async (msg) => {
            console.log('Mensagem recebida:', msg.body);
            await this.handleIncomingMessage(msg);
        });

        this.client.on('authenticated', () => {
            console.log('Autenticação realizada com sucesso');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('Falha na autenticação', msg);
        });
    }

    async handleIncomingMessage(msg) {
        try {
            // Lógica personalizada para tratamento de mensagens
            if (msg.body.toLowerCase() === 'ping') {
                await msg.reply('pong');
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    }

    setupRoutes() {
        this.app.post('/send', async (req, res) => {
            const { number, message } = req.body;
            
            if (!number || !message) {
                return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
            }

            try {
                await this.sendMessage(number, message);
                res.json({ status: 'Mensagem enviada com sucesso' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Rota de status do serviço
        this.app.get('/status', (req, res) => {
            res.json({
                status: this.client.state,
                isAuthenticated: this.client.isRegistered
            });
        });
    }

    async sendMessage(number, message) {
        const chatId = `${number}@c.us`;
        await this.client.sendMessage(chatId, message);
    }

    initialize() {
        this.client.initialize();
    }

    start(port = 3000) {
        this.initialize();
        this.app.listen(port, () => {
            console.log(`Serviço WhatsApp rodando na porta ${port}`);
        });
    }
}

// Inicialização do serviço
const whatsappService = new WhatsAppService();
whatsappService.start();