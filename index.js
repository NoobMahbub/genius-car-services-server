require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;



//use middleware
app.use(cors());
// app.use(dotenv());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jlpkren.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {

    try {

        await client.connect();
        console.log('database connected');


        const serviceCollection = client.db('geniusCar').collection('service');
        app.get('/service', async (req, res) => {

            const services = await serviceCollection.find({}).toArray();
            res.send(services)
        });


        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //POST
        app.post('/service',async(req, res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        //Delete
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);
// run.Catch(console.dir);
app.get('/', (req, res) => {
    res.send('Running Crud!')
});


app.listen(port, () => {
    console.log('Listening to port', port);
})

