FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /Portfolio

# Copia solo package.json e package-lock.json prima per sfruttare la cache
COPY package*.json ./

RUN npm install

# Copia tutto il resto del progetto
COPY . .

# Espone la porta che usi (modifica se necessario)
EXPOSE 3000

CMD ["npm", "start"]
