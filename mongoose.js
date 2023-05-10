const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI; // your MongoDB URI
const mySecretDB = process.env['MONGOD_PASSWORD']

const uri = "mongodb+srv://dbGOD:"+mySecretDB+"@atlascluster.qvihzep.mongodb.net/?retryWrites=true&w=majority";

// pass the MongoDB connection to Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// handle MongoDB connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));
