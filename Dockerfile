FROM node:16

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "build/index.js" ]
