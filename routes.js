const express = require('express');
const QRCode = require('qrcode');

module.exports = function(whatsappService) {
    const router = express.Router();

    router.post('/send', async (req, res) => {
        const { number, message } = req.body;
        
        if (!number || !message) {
            return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
        }

        try {
            await whatsappService.sendMessage(number, message);
            res.json({ status: 'Mensagem enviada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/status', (req, res) => {
        res.json({
            status: whatsappService.getClient().state,
            isAuthenticated: whatsappService.getClient().isRegistered
        });
    });

    router.get('/qrcode', async (req, res) => {    
        try {
            const qrCodeString = whatsappService.qrCodeString;
            const qrCodeImage = await QRCode.toDataURL(qrCodeString);

            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>WhatsApp QR Code</title>
                <style>
                    body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f2f5; }
                    .container { text-align: center; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                    img { max-width: 300px; margin: 20px 0; }
                    .status { color: #075e54; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>WhatsApp QR Code</h1>
                    <p class="status">Status: Aguardando conexão</p>
                    <img src="${qrCodeImage}" alt="WhatsApp QR Code">
                    <p>Escaneie o QR Code com seu WhatsApp</p>
                </div>
                <script> setTimeout(() => { window.location.reload(); }, 30000); </script>
            </body>
            </html>
            `;
        
            res.send(html);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar QR Code', details: error.message });
        }
    });

    return router;
};
