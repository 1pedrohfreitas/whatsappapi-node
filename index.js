const WhatsAppService = require('./WhatsAppService');
const setupRoutes = require('./routes');

const PORT = process.env.PORT || 3000;

// Inicializando o serviço
const whatsappService = new WhatsAppService();
whatsappService.initialize();

const app = whatsappService.getApp();

// Configurando as rotas
app.use('/', setupRoutes(whatsappService));

app.listen(PORT, () => {
    console.log(`Serviço WhatsApp rodando na porta ${PORT}`);
});
