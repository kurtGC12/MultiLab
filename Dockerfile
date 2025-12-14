# ===================================================================
# FASE 1 – BUILD Angular
# ===================================================================
FROM node:22.12.0 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx ng build --configuration production


# ===================================================================
# FASE 2 – NGINX para servir Angular compilado
# ===================================================================
FROM nginx:alpine

# Copia el build Angular
COPY --from=builder /app/dist/MultiLab/browser /usr/share/nginx/html

# Copia configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
