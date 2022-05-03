const express = require("express");
const cors = require("cors");
const server = require('./grpc_server')
server.server();

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());

/*app.get('/inventory', async (req, res) => {
    const variable = req.query.name;
    try {
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
    } catch (error) {
        console.log(error);
    }
});*/

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
