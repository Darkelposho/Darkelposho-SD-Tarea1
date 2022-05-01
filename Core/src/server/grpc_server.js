const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./search.proto";
const dotenv = require('dotenv')
const Pool = require('pg').Pool
const poolGRPC = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'marihuana',
    database: 'tiendita',
    port: 5432,
});
dotenv.config();



const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const itemProto = grpc.loadPackageDefinition(packageDefinition);

var items = []

const server = () => {
  const server = new grpc.Server();
  server.addService(itemProto.ItemService.service, {
    getItem: (_, callback) => {
      const itemName = _.request.name;
      console.log(itemName);
      if(itemName){
        poolGRPC.query(`SELECT * FROM items WHERE name like '%' || '${itemName}' || '%';`, (err, res) => {
          items = res.rows
          console.log(items);
          if(err){
            console.log(err.stack);
          }
          const item = items.filter((obj) => obj.name.includes(itemName));
          callback(null, { items: item});
      })
      
    }else {
      callback(null, {
        message: "No item found"
      })
    }
  }

  });
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) console.log(err);
    else {
      console.log("GRPC SERVER RUN AT http://localhost:50051");
      server.start();
    }
  });
};

exports.server = server;