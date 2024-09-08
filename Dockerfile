# Base image olarak Node.js kullanıyoruz
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Gerekli dosyaları çalışma dizinine kopyala
COPY package.json ./
COPY package-lock.json ./

# Bağımlılıkları yükle
RUN npm install

# Kalan tüm dosyaları kopyala
COPY . .

# Projeyi build et (Next.js için)
RUN npm run build

# Uygulama çalıştırma komutu
CMD ["npm", "start"]

# Uygulamanın çalışacağı portu belirt
EXPOSE 3200