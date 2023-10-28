const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);
const router = express.Router()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"));

// old code 
const uri = `${process.env.DATABASE_MONGODB}`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// call middlewares
// const { verifyJWT, verifyAdmin } = require('./src/middlewares/middlewares');
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
        const productsCollection = client.db("theCakeStandDB").collection("products");
        const productReviewCollection = client.db("theCakeStandDB").collection("productReview");
        const reviewCollection = client.db("theCakeStandDB").collection("reviews");
        const cartCollection = client.db("theCakeStandDB").collection("carts");
        const paymentCollection = client.db("theCakeStandDB").collection("payments");
        const reservationCollection = client.db("theCakeStandDB").collection("reservation");

        // jwt
        router.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '9000d' })
            res.send({ token })
        })
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            if (user?.role !== 'admin') {
                return res.status(403).send({ error: true, message: 'forbidden message' })
            }
            next()
        }

        // users related apis
        router.get('/users', verifyJWT, verifyAdmin, async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        router.post('/users', async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: "User already exists" })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        router.get('/users/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email

            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }

            const query = { email: email }
            const user = await usersCollection.findOne(query)
            const result = { admin: user?.role === 'admin' }
            res.send(result)
        })

        router.patch('/users/admin/:id', async (req, res) => {
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
        router.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        router.get('/menu/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await menuCollection.findOne(query);
            if (!result) {
                return res.status(404)
                    .json({ message: "Menu item not found" });
            }
            res.send(result);
        });

        router.post('/menu', verifyJWT, verifyAdmin, async (req, res) => {
            const newItem = req.body
            const result = await menuCollection.insertOne(newItem)
            res.send(result)
        })

        router.delete('/menu/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await menuCollection.deleteOne(query)
            res.send(result)
        })

        // product like menu
        router.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        router.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await productsCollection.findOne(query);
            if (!result) {
                return res.status(404)
                    .json({ message: "Menu item not found" });
            }
            res.send(result);
        });

        router.post('/products', async (req, res) => {
            const newItem = req.body
            const result = await productsCollection.insertOne(newItem)
            res.send(result)
        })

        router.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })

        // review collection
        router.post('/review', async (req, res) => {
            const newReview = req.body
            console.log(newReview)
            const result = await reviewCollection.insertOne(newReview)
            res.send(result)
        })
        router.get('/review', async (req, res) => {
            const result = await reviewCollection.find().sort({ _id: -1 }).toArray()
            res.send(result)
        })
        router.get("/review/:id", async (req, res) => {
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
        router.get('/carts', verifyJWT, async (req, res) => {
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
        router.post('/carts', async (req, res) => {
            const item = req.body
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })

        router.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })

        // product review
        router.post('/product-review', async (req, res) => {
            const review = req.body
            const result = await productReviewCollection.insertOne(review)
            res.send(result)
        })
        // get review
        router.get('/product-review', async (req, res) => {
            const result = await productReviewCollection.find().sort({ _id: -1 }).toArray();
            res.send(result)
        })

        router.get('/product-review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { productId: id };
            const result = await productReviewCollection.find(query).sort({ _id: -1 }).toArray();
            res.send(result)
        })

        // Reservation
        router.post('/reservation', async (req, res) => {
            const newReservation = req.body
            console.log(newReservation)
            const result = await reservationCollection.insertOne(newReservation)
            res.send(result)
        })

        router.get('/reservation', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await reservationCollection.find(query).toArray();
            res.send(result)
        })
        router.get('/all-reservation', async (req, res) => {
            const result = await reservationCollection.find().toArray();
            res.send(result)
        })

        // Stripe payment
        router.post("/create-payment-intent", verifyJWT, async (req, res) => {
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
        router.post('/payments', verifyJWT, async (req, res) => {
            const payment = req.body;
            const insertResult = await paymentCollection.insertOne(payment);

            const query = { _id: { $in: payment.cartItems.map(id => new ObjectId(id)) } }
            const deleteResult = await cartCollection.deleteMany(query)

            res.send({ insertResult, deleteResult });
        })

        router.get('/admin-stats', async (req, res) => {
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
        router.get("/user-stats", async (req, res) => {
            const email = req.query.email;
            console.log(email)
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

        router.get('/orders-stats', async (req, res) => {
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
        console.log("The Caka Stand Server successfully connected to MongoDB!");

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
module.exports = router;
