FROM node:16

WORKDIR /usr/src/app
COPY . ./
RUN npm install

ENV HOST=0.0.0.0
ENV PORT=8080
RUN npm run build

CMD ["npm", "run", "start"]