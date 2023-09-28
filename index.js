const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
require('dotenv').config();

const cors = require('cors');
const port = process.env.PORT || 5000;
/* 
theCakeStandDB
user: cakeStandUser
pass: BVx7L9vWs0E2k2AS
*/
// middleware
app.use(cors())
app.use(express.json())

const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access' });
    }
    // bearer token
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0aavw86.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db("theCakeStandDB").collection("users");
        const menuCollection = client.db("theCakeStandDB").collection("menu");
        const reviewCollection = client.db("theCakeStandDB").collection("reviews");
        const cartCollection = client.db("theCakeStandDB").collection("carts");



        // jwt
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '9000d' })
            res.send({ token })
        })

        //Warning : use verifyJWT before using verifyAdmin
        // verify admin middleware
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            if (user?.role !== 'admin') {
                return res.status(403).send({ error: true, message: 'forbidden message' })
            }
            next()
        }

        /* secure route
        0. do not show secure links to those who should not see the links
        1. user jwt token: verifyToken
        2. use verifyAdmin middlewares
        
        */
        // users related apis
        app.get('/users', verifyJWT, verifyAdmin, async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: "User already exists" })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        /* security layer : 
        1. verifyJWT
        2. email same
        3. check admin
         */
        app.get('/users/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email

            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }

            const query = { email: email }
            const user = await usersCollection.findOne(query)
            const result = { admin: user?.role === 'admin' }
            res.send(result)
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // menu related apis
        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        app.post('/menu', verifyJWT, verifyAdmin, async (req, res) => {
            const newItem = req.body
            const result = await menuCollection.insertOne(newItem)
            res.send(result)
        })

        app.delete('/menu/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await menuCollection.deleteOne(query)
            res.send(result)
        })


        // review collection
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })


        // cart collection apis
        // app.get('/carts', verifyJWT, async (req, res) => {
        app.get('/carts', verifyJWT, async (req, res) => {
            const email = req.query.email
            console.log(email)
            if (!email) {
                res.send([])
            }

            const decodedEmail = req.decoded.email
            if (email !== decodedEmail) {
                return res.status(401).send({ error: true, message: 'Forbidden access' })
            }

            const query = { email: email }
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        })
        app.post('/carts', async (req, res) => {
            const item = req.body
            console.log(item)
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
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
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('The cake stand in running')
})

app.listen(port, () => {
    console.log(`The cake stand server in running on port ${port}`)
})








/* 
---------
naming convention

1. users: userCollection
2. app.get('/users')
2. app.get('/users/:id')
2. app.post('/users')
2. app.patch('/users/:id')
2. app.put('/users/:id')
2. app.delete('/users/:id')



-----------


*/










