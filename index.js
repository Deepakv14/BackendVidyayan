const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/quotes', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.post('/api/register', async(req, res) => {
    // console.log(req.body);

    try {
        const user = await User.create(req.body);
        res.json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 'error',
            error: 'Duplicate email',
        });
    }

});

app.post('/api/login', async(req, res) => {
    // console.log(req.body);
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (user) {
        const token = jwt.sign({
                name: user.name,
                email: user.email,
            },
            'secret123'
        )
        return res.json({
            status: 'success',
            user: token,
        });
    } else {
        res.json({
            status: 'error',
            // error: 'Invalid email or password',
            user: false
        });
    }


});


app.listen(1337, () => {
    console.log('Example app listening on port 1337!');
});