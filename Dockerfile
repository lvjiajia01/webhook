FROM node
LABEL name="server"
LABEL version="1.0"
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3001
CMD npm run start:pm