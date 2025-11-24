# ===================================================================
# FASE 1 – BUILD Angular
# ===================================================================
FROM node:22.12.0 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

# ===================================================================
# FASE 2 – RUN: nginx para servir Angular compilado
# ===================================================================
FROM nginx:alpine

# Copiamos el build generado hacia la carpeta pública de NGINX
COPY --from=build /app/dist/MultiLabs/browser /usr/share/nginx/html

# Copiamos configuración de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
