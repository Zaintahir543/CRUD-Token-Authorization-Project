require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// require('dotenv').config();

const authRoutes = require('./routes/auth');
const stripeRoute = require('./routes/stripeRoute');


const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(
            `✅ MongoDB Connected: ${mongoose.connection.name}`
        );
    })
    .catch(err => console.log('❌ MongoDB Error:', err));
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log('MongoDB Error:', err));

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/stripe', stripeRoute)

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.send('API is working Server is Running');
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
