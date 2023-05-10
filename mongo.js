const { MongoClient, ServerApiVersion } = require('mongodb');
const mySecretDB = process.env['MONGOD_PASSWORD']

const uri = "mongodb+srv://dbGOD:"+mySecretDB+"@atlascluster.qvihzep.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

module.exports = { client, connect };
