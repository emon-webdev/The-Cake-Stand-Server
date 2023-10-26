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
const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email
    const query = { email: email }
    const user = await usersCollection.findOne(query)
    if (user?.role !== 'admin') {
        return res.status(403).send({ error: true, message: 'forbidden message' })
    }
    next()
}


module.exports = {
    verifyJWT,
    verifyAdmin,
};