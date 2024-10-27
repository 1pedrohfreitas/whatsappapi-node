# Use uma imagem base do Node.js
FROM node:18

# Configura o diretório de trabalho dentro do container
WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libcups2 \
    libxshmfence1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# Clona o repositório da branch main
RUN git clone --branch main https://github.com/1pedrohfreitas/whatsappapi-node.git .

# Instala as dependências do projeto
RUN npm install

# Realiza o build do TypeScript
RUN npm run build

# Expõe a porta 8000
EXPOSE 10000

# Comando para iniciar a aplicação
CMD ["node", "dist/src/app.js"]
