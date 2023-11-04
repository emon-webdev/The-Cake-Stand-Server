const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);
const cors = require('cors');
const port = process.env.PORT || 5000;

/* 
theCakeStandDB
user: cakeStandUser
pass: BVx7L9vWs0E2k2AS
*/
// middleware
app.use(cors())
app.use(express.static("public"));
app.use(express.json())

// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
//     console.log('Database connection is successful with mongoose')
// });
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0aavw86.mongodb.net/?retryWrites=true&w=majority`;
const uri = `${process.env.DATABASE_MONGODB}`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


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



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const usersCollection = client.db("theCakeStandDB").collection("users");
        const menuCollection = client.db("theCakeStandDB").collection("menu");
        const productReviewCollection = client.db("theCakeStandDB").collection("productReview");
        const reviewCollection = client.db("theCakeStandDB").collection("reviews");
        const cartCollection = client.db("theCakeStandDB").collection("carts");
        const paymentCollection = client.db("theCakeStandDB").collection("payments");
        const reservationCollection = client.db("theCakeStandDB").collection("reservation");


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


        app.get('/menu/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await menuCollection.findOne(query);
            if (!result) {
                return res.status(404)
                    .json({ message: "Menu item not found" });
            }
            res.send(result);
        });

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
        app.post('/review', async (req, res) => {
            const newReview = req.body
            const result = await reviewCollection.insertOne(newReview)
            res.send(result)
        })
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().sort({ _id: -1 }).toArray()
            res.send(result)
        })
        app.get("/review/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await reviewCollection.findOne(query);

                if (!result) {
                    return res.status(404).json({ message: "Review not found" });
                }

                res.send(result);
            } catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
        // cart collection apis
        // app.get('/carts', verifyJWT, async (req, res) => {
        app.get('/carts', verifyJWT, async (req, res) => {
            const email = req.query.email
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
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })

        // product review
        app.post('/product-review', async (req, res) => {
            const review = req.body
            const result = await productReviewCollection.insertOne(review)
            res.send(result)
        })
        // get review
        app.get('/product-review', async (req, res) => {
            const result = await productReviewCollection.find().sort({ _id: -1 }).toArray();
            res.send(result)
        })

        app.get('/product-review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { productId: id };
            const result = await productReviewCollection.find(query).sort({ _id: -1 }).toArray();
            res.send(result)
        })

        // Reservation
        app.post('/reservation', async (req, res) => {
            const newReservation = req.body
            const result = await reservationCollection.insertOne(newReservation)
            res.send(result)
        })

        app.get('/reservation', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await reservationCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/all-reservation', async (req, res) => {
            const result = await reservationCollection.find().toArray();
            res.send(result)
        })

        // Stripe payment
        //create payment intent

        app.post("/create-payment-intent", verifyJWT, async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card']
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        });


        // payment related api
        app.post('/payments', verifyJWT, async (req, res) => {
            const payment = req.body;
            const insertResult = await paymentCollection.insertOne(payment);

            const query = { _id: { $in: payment.cartItems.map(id => new ObjectId(id)) } }
            const deleteResult = await cartCollection.deleteMany(query)

            res.send({ insertResult, deleteResult });
        })

        app.get('/admin-stats', async (req, res) => {
            const users = await usersCollection.estimatedDocumentCount();
            const products = await menuCollection.estimatedDocumentCount()
            const orders = await paymentCollection.estimatedDocumentCount()
            const payments = await paymentCollection.find().toArray()
            const revenue = payments.reduce((sum, payment) => sum + payment.price, 0)
            //best way to get sum of a field is to use group and sum operator
            res.send({
                users,
                products,
                orders,
                revenue
            })
        })

        // get all products (for my products)
        //    `https://car-showroom-server.vercel.app/products?email=${user?.email}`
        app.get("/user-stats", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const reviews = await reviewCollection.find(query).sort({ _id: -1 }).toArray();
            const bookings = await cartCollection.find(query).sort({ _id: -1 }).toArray();
            const payments = await paymentCollection.find(query).sort({ _id: -1 }).toArray();
            const reservation = await reservationCollection.find(query).toArray();
            res.send({
                reviews,
                bookings,
                payments,
                reservation
            });
        });

        /* 
        0. Bangla system (second best solution)
        1. load all payments 
        2. for each payment , get menuitems array
        3. for each item in the menuitems  array get the menuItem from the menuCollection
        4. put them in an array: allOrderedItems
        5. separate allOrderedItems by category using filter
        6. now get the quantity by using length: pizzas.lenght
        7. for each category use reduce to get the total amount spent on this category
        */

        app.get('/orders-stats', async (req, res) => {
            const pipeline = [
                {
                    $lookup: {
                        from: 'menu',
                        localField: 'menuItems',
                        foreignField: '_id',
                        as: 'menuItemsData'
                    }
                },
                {
                    $unwind: '$menuItemsData'
                },
                {
                    $group: {
                        _id: '$menuItemsData.category',
                        count: { $sum: 1 },
                        total: { $sum: '$menuItemsData.price' }
                    }
                },
                {
                    $project: {
                        category: '$_id',
                        count: 1,
                        total: { $round: ['$total', 2] },
                        _id: 0
                    }
                }
            ];

            const result = await paymentCollection.aggregate(pipeline).toArray()
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
    res.send('The cake stand in running v2')
})

app.listen(port, () => {
    console.log(`The cake stand server in running on port ${port}`)
})


module.exports = app





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










/* 
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
*/