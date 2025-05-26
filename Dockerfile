FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Installa le librerie di sistema aggiuntive richieste dai browser Playwright
RUN apt-get update && \
    apt-get install -y \
      libgtk-4-1 \
      libgraphene-1.0-0 \
      libgstreamer-gl1.0-0 \
      libgstreamer-plugins-bad1.0-0 \
      libavif15 \
      libenchant-2-2 \
      libsecret-1-0 \
      libmanette-0.2-0 \
      libgles2 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /Portfolio

# Copia solo i file delle dipendenze per sfruttare la cache Docker
COPY package*.json ./

RUN npm install

# Copia il resto del progetto
COPY . .

# Espone la porta usata dall'applicazione Node.js
EXPOSE 3000

# Avvia l'applicazione
CMD ["npm", "start"]
