const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// middlewire
app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nwzqkqi.mongodb.net/?retryWrites=true&w=majority`;

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

    const addServices = client.db('momentCapture').collection('services');
    const bookingCollection = client.db('momentCapture').collection('bookings');


    app.post('/addService', async(req, res) =>{
        const addService = req.body;
        console.log(addService);
        const result = await addServices.insertOne(addService);
        res.send(result);
      })
      
      app.get('/addService', async(req, res) =>{
        const cursor = addServices.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/addService/:id', async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const options = {
            projection: {title: 1, photographerName: 1,  position: 1, price: 1},
        };

        const result = await addServices.findOne(query, options);
        res.send(result);
      })

    //   booking
      app.post('/bookings', async(req, res) =>{
        const addBookings = req.body;
        console.log(addBookings);
        const result = await bookingCollection.insertOne(addBookings);
        res.send(result);
      })
      app.get('/bookings', async(req, res) =>{
        let query = {};
        if(req.query?.email){
          query = {email: req.query.email}
        }
        const result = await bookingsCollection.find(query).toArray();
        res.send(result);
      })
    //   app.delete('/Bookings/:id', async(req, res) =>{
    //     const id = req.params.id;
    //     const query = {_id: new ObjectId(id)};
    //     const result = await bookingsCollection.deleteOne(query);
    //     res.send(result);
    //   })

    //   app.patch('/Bookings/:id', async(req, res)=> {
    //     const id = req.params.id;
    //     const filter = {_id: new ObjectId(id)};
    //     const updatedBookings = req.body;
    //     console.log(updatedBookings);
    //     const updateDoc = {
    //       $set: {
    //         status: updatedBookings.status
    //       },
    //     };
    //     const result = await bookingsCollection.updateOne(filter, updateDoc);
    //     res.send(result);
    //   })


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
    res.send('This server is running')
})
app.listen(port, () => {
    console.log(`This server is runig on port ${port}`)
})