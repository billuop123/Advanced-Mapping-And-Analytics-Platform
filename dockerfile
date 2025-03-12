FROM node:20-alpine
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
RUN npm run db:generate
EXPOSE 3001
CMD ["npm", "run","dev:docker"]
