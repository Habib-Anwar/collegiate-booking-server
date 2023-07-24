const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.87bzbwh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const collegiateCollection = client.db("collegiateDb").collection("collegiate");
    const collegeCollection = client.db("collegiateDb").collection("college");
    const userInfoCollection = client.db("collegiateDb").collection("userInfo");
    const reviewCollection = client.db("collegiateDb").collection("review");

    app.get('/collegiate', async(req, res) =>{
        const result = await collegiateCollection.find().toArray();
        res.send(result);
    })
    app.get('/college', async(req, res) =>{
        const result = await collegeCollection.find().toArray();
        res.send(result);
    })
    app.get('/review', async(req, res) =>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })

    app.post('/userInfo', async (req, res) => {
      const userInfo = req.body;
      console.log(userInfo);
      const query = { email: userInfo.email, name: userInfo.name }
      const existingUser = await userInfoCollection.findOne(query);
      console.log(existingUser)
      if (existingUser) {
        return res.send({ message: 'userInfo already exists' })
      }
      const result = await userInfoCollection.insertOne(userInfo);
      res.send(result);
    })
  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('collegiate is booking')
})

app.listen(port, () =>{
    console.log(`Collegiate is booking on port ${port}`)
})
