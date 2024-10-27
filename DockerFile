# Use uma imagem base do Node.js
FROM node:18

# Configura o diretório de trabalho dentro do container
WORKDIR /app

# Clona o repositório da branch main
RUN git clone --branch main https://github.com/1pedrohfreitas/whatsappapi-node.git .

# Instala as dependências do projeto
RUN npm install

# Realiza o build do TypeScript
RUN npx tsc

# Expõe a porta 8000
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["node", "dist/src/app.js"]
