const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const data = require('./src/db/data')
const server = require("./src/server/grpc_server");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./src/example.proto";
const Pool = require('pg').Pool

const poolGRPC = new Pool ({
  host: 'localhost',
  user: 'postgres',
  password: 'marihuana',
  database: 'tiendita',
  port: 6379,
});

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const ItemService = grpc.loadPackageDefinition(packageDefinition).ItemService;
const client = new ItemService("localhost:50051", grpc.credentials.createInsecure());
const { createClient } = require("redis");

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
dotenv.config()
server.server();

const clientredis = createClient({
  host: process.env.REDIS_HOST,   
  port: 6379
});


var port = process.env.PORT || 3000;
var ip = process.env.PORT || 'localhost';

app.get('/', async (req, res) => {
  try {
    const reply = await clientredis.get(req.query);  
    console.log(req.query);
    console.log(reply);
    if(reply){
      console.log("using cached data");
      return res.send(JSON.parse(reply))
    }else{
      const filters = req.query;
      const filteredUsers = data.filter(user => {
        let isValid = true;
        for (key in filters) {
          console.log(key, user[key], filters[key]);
          isValid = isValid && user[key] == filters[key];
        }
        return isValid;
      });
      const saveResult = clientredis.set(req.query, JSON.stringify(filteredUsers));
      console.log(saveResult)
      res.header("Access-Control-Allow-Origin","*");
      const response = await poolGRPC.query(`select * from items;`);
      console.log("Getting all clientes");
      res.json(response.rows);

      res.send(filteredUsers);  
    }
  }catch (error) {
    console.log(error);
    res.send(error.message);
  }
  });

async function main() {
  await clientredis.connect();
  app.listen(port, ip, function () {
    console.log('Server running on port ' + port);
  }); 
}

main();