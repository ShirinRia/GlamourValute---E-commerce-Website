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

      res.send(result)
    })
    // get cart data for a user from mongodb
    app.get('/carts/:uid', async (req, res) => {
      const uid = req.params.uid
      console.log(uid)
      const query = {
        UserUid: uid
      }
      const cursor = await cartcollection.find(query)
      const result = await cursor.toArray();
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
    // add cart to database
    app.post('/carts', async (req, res) => {
      const cartProduct = req.body
      console.log(cartProduct)
      const result = await cartcollection.insertOne(cartProduct);
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
    // update product data
    app.put('/products/:BrandName/:id', async (req, res) => {

      const id = req.params.id
      const brand = req.params.BrandName
      const query = {
        BrandName: brand,
        _id: new ObjectId(id)
      }
      /* Set the upsert option to insert a document if no documents match the filter */
      const options = {
        upsert: true
      };
      // Specify the update to set a value for the plot field
      const updateproduct = req.body
      console.log(updateproduct)
      const updateproductdoc = {
        $set: {
          product_name:updateproduct.product_name,
          BrandName:updateproduct.BrandName,
          product_type :updateproduct.product_type,
          product_price :updateproduct.product_price,
          product_rating:updateproduct.product_rating,
          product_description :updateproduct.product_description,
          product_photo:updateproduct.product_photo,
          product_amount:updateproduct.product_amount
        
        },
      };

      // Update the first document that matches the filter
      const result = await productcollection.updateOne(query, updateproductdoc, options);
      res.send(result)
    })

    // delete data from cart
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id
      console.log('cartid', id)
      const query = {
        _id: id
      }
      const result = await cartcollection.deleteOne(query)
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