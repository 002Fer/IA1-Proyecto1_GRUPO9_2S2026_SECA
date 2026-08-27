# Docker de frontend

# Construccion
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el codigo fuente
COPY . .

# Argumento para URL del backend en tiempo de compilacion
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Compila proyecto para la produccion
RUN npm run build

# Servidor Web Nginx
FROM nginx:alpine

# Copia archivos compilados al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto web
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
