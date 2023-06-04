const express=require('express')
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express();
const port=process.env.PORT || 5000;
// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.bx18cif.mongodb.net/?retryWrites=true&w=majority`;

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

    const coffeeColection=client.db('coffeeDB').collection("coffee")
    // read
    app.get("/coffee",async(req,res)=>{
        const cursor=coffeeColection.find();
        const result=await cursor.toArray();
        res.send(result)
    })

    app.get('/coffee/:id',async(req,res)=>{
        const id=req.params.id ;
        const query={_id : new ObjectId(id)}
        const result=await coffeeColection.findOne(query)
        res.send(result)
    })
    // post
    app.post('/coffee',async(req,res)=>{
        const newCoffee=req.body;
        const result=await coffeeColection.insertOne(newCoffee)
        res.send(result)
    })
    // update
    app.put('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const updatedCoffee=req.body;
        const filter={_id: new ObjectId(id)};
        const option={upsert:true}
        const coffee={
            $set:{
                name:updatedCoffee.name,
                quantity:updatedCoffee.quantity,
                supplier:updatedCoffee.supplier,
                taste:updatedCoffee.taste,
                category:updatedCoffee.category,
                photo:updatedCoffee.photo,
                details:updatedCoffee.details
            }
        }
        const result=await coffeeColection.updateOne(filter,coffee,option)
        res.send(result)
    })
    // delete
    app.delete('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id) }
        const result=await coffeeColection.deleteOne(query);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.col);


app.get('/',(req,res)=>{
    res.send('coffee making server is running')
})

app.listen(port,()=>{
    console.log(`simple coffee port:${port}`)
})