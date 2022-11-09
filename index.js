const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// Midleware
app.use(cors());
app.use(express.json());


// DB usrname = weddingPhotography
// DB passwrod = rSiuCswBf35xqqOv

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = "mongodb+srv://weddingPhotography:rSiuCswBf35xqqOv@cluster0.k4gmzpi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        const weddingCollection = client.db("wedding").collection("details");
        const weddingReviews = client.db("wedding").collection("reviews");

        // For HomePage 

        app.get('/limit', async(req, res) =>{
            const query = {}
            const cursor = weddingCollection.find(query).sort({_id:-1});
            const products = await cursor.limit(3).toArray();
            res.send(products);
        });

        // Add service form Client side 
        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = await weddingCollection.insertOne(service);
            res.send(result);
        })

        // End Homepage 

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = weddingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await weddingCollection.findOne(query);
            res.send(result);
        })

        // Post a data to the DB from client
        app.post('/reviews', async(req, res)=> {
            const review = req.body;
            const result = await weddingReviews.insertOne(review);
            res.send(result);
        })

        // Find a spesic person data
        app.get('/reviews', async(req, res) => {
            let query = {}
            if(req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = weddingReviews.find(query).sort({_id:-1});
            const result = await cursor.toArray();
            res.send(result);
        })

        // Find a spesic Service data
        app.get('/sns', async(req, res) => {
            let query = {}
            if(req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = weddingReviews.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // Delete a Review 
        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await weddingReviews.deleteOne(query);
            res.send(result);
        })


        // Find a review to update
        app.get('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await weddingReviews.findOne(query);
            res.send(result);
        })

        // Update a review 
        app.put('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const body = req.body;
            const options = { upsert: true };
            const updateReview = {
                $set: {
                    message: body.message,
                }
            }
            const result = await weddingReviews.updateOne(query, updateReview, options);
            res.send(result);
            
        })


    }
    finally {

    }
}
run().catch();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})