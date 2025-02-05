const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
let  qrCodeString = '';

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
            this.qrCodeString = qr;
            qrcode.generate(qr, { small: true });
            console.log(qr)
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

        this.app.get('/qrcode', async (req, res) => {    
            try {

                const qrCodeImage = await QRCode.toDataURL(this.qrCodeString);

                const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>WhatsApp QR Code</title>
                    <style>
                        body {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            margin: 0;
                            font-family: Arial, sans-serif;
                            background-color: #f0f2f5;
                        }
                        .container {
                            text-align: center;
                            padding: 20px;
                            background: white;
                            border-radius: 10px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        }
                        img {
                            max-width: 300px;
                            margin: 20px 0;
                        }
                        .status {
                            color: #075e54;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>WhatsApp QR Code</h1>
                        <p class="status">Status: Aguardando conexão</p>
                        <img src="${qrCodeImage}" alt="WhatsApp QR Code">
                        <p>Escaneie o QR Code com seu WhatsApp</p>
                    </div>
                    <script>
                        setTimeout(() => {
                            window.location.reload();
                        }, 30000);
                    </script>
                </body>
                </html>
            `;
            
            res.send(html);
                
                // res.json({ 
                //     qrCode: qrCodeImage,
                //     message: 'Escaneie o QR Code com o WhatsApp' 
                // });
            } catch (error) {
                res.status(500).json({ 
                    error: 'Erro ao gerar QR Code', 
                    details: error.message 
                });
            }
        });
    }

    async sendMessage(number, message) {
        const chatId = `${number}@c.us`;
        await this.client.sendMessage(chatId, message);

    }

    initialize() {
        this.client.initialize();
    }

    start() {
        this.initialize();
        this.app.listen(PORT, () => {
            console.log(`Serviço WhatsApp rodando na porta ${PORT}`);
        });
    }
}

// Inicialização do serviço
const whatsappService = new WhatsAppService();
whatsappService.start();