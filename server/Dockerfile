FROM node:20.9.0

WORKDIR /server

COPY package*.json ./
COPY nodemon.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 4000

# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]