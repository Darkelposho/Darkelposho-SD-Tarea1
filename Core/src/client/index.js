const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const axios = require('axios');
const { createClient } = require("redis");

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
dotenv.config()

var port = process.env.PORT || 3000;
var ip = process.env.PORT || 'localhost';

const clientredis = createClient({
  host: process.env.REDIS_HOST,   
  port: 6379
});

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
        axios.get('http://localhost:8000/inventory',
         {
           params: {
              name: variable
             }
          }).then(resi => {
            console.log(resi.data);
            clientredis.set(variable, JSON.stringify(resi.data));
            res.json(resi.data);
          }).catch(err => {
            //console.log(err);
          })
      }
    })();
  });

async function main() {
  try {
    await clientredis.connect();
    app.listen(port, ip, function () {
      console.log('Server running on port ' + port);
    }); 
  } catch (error) {
    console.log(error);
  }
}

main();