const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const grpc = require('./grpc_client');
const { createClient } = require("redis");

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
dotenv.config()

var port = process.env.PORT || 3000;

const clientredis = createClient({
  url: 'redis://redis:6379'
});

clientredis.on('error', (err) => console.log('Redis Client Error', err));




  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.get('/inventory/search', (req, res) => {
    const variable = req.query.q;
    (async () => {
      let reply = await clientredis.get(variable);  
      if(reply){
        console.log("using cached data");
        return res.send(JSON.parse(reply))
      }else{
        console.log("getting data from grpc");
        if(variable){
          grpc.GetItem({name: variable}, (err, response) => {
          if(err){
          console.log(err);
          res.json({})
          }else{ 
          res.json(response);
          }
          })
        }
      }
    })();
  });

async function main() {
  try {
    await clientredis.connect();
    app.listen(port, function () {
      console.log('Server running on port ' + port);
    }); 
  } catch (error) {
    console.log(error);
  }
}

main();