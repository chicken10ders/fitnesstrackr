// create the express server here
//require("dotenv").config();
const { PORT = 3000 } = process.env;

const express = require("express");
const server = express();
//server.use(express.json());

//const cors = require("cors");
//server.use(cors());

const apiRouter = require("./api");
server.use("/api", apiRouter);

const { client } = require("./db/client");

server.use((error, req, res, next) => {
  res.status(400);
  res.send(error);
});

server.listen(PORT, () => {
  console.log(`Server is up`);
  client.connect();
});
