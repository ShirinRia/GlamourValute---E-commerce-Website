const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
const express = require('express')
var cors = require('cors')
require('dotenv').config()
var app = express()

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

USERNAME = process.env.S3_BUCKET
PASS = process.env.SECRET_KEY
const uri = `mongodb+srv://${USERNAME}:${PASS}@cluster0.xrp2z6o.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const productcollection = client.db("product").collection("productdata");
    const usercollection = client.db("product").collection("userdata");
    const cartcollection = client.db("product").collection("cartdata");
    // get all data from database
    app.get('/products', async (req, res) => {
      const cursor = productcollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    // get specific brand data from mongodb
    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand
      console.log(brand)
      const query = {
        BrandName: brand
      }
      const cursor = await productcollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    })
    // get specific id data from mongodb
    app.get("/products/:brand/:id", async (req, res) => {
      const brand = req.params.brand
      const id = req.params.id
      const query = {
        BrandName: brand,
        _id: new ObjectId(id)
      }
      const result = await productcollection.findOne(query)
      // const result = await cursor.toArray();
      res.send(result)
    })
    // add new product to database
    app.post('/products', async (req, res) => {
      const products = req.body
      console.log(products)
      const result = await productcollection.insertOne(products);
      res.send(result)
    })
    // add new user to database
    app.post('/users', async (req, res) => {
      const user = req.body
      console.log(user)
      const result = await usercollection.insertOne(user);
      res.send(result)
    })

    // update userdata
    app.patch('/users', async (req, res) => {

      const user = req.body
      const query = {
        email: user.email
      }
     
      const updateuserdb = {
        $set: {
          lastloggedat: user.lastloggedat
        },
      };
      // Update the first document that matches the filter
      const result = await usercollection.updateOne(query, updateuserdb);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({
      ping: 1
    });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})