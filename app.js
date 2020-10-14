const express = require('express');
const mongoose = require('mongoose');
const {MONGO_URI} = require('./config/keys')
const port = process.env.PORT || 5000;

const app = express();


mongoose.connect(MONGO_URI,
    { 
        useNewUrlParser: true,
        useFindAndModify: false, 
        useUnifiedTopology: true 
    }
);
    
    mongoose.connection.on('connected', () => {
        console.log(`connected to mongodb`);
    }
);
    
    mongoose.connection.on('error', (err) => {
        console.log(`error to connecting: ${err}`);
    }
);

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

/* make costum middleware */
/* const costumeMiddleware = (req,res,next) => {
    console.log("middleware executed!!");
    next();
} */

/* used middleware in general */
// app.use(costumeMiddleware);

/* app.get('/', (req, res) => {
    console.log('home');
    res.send('Hello world')
}); */

/* TODO: used Middleware in each route or request */
/* app.get('/about', costumeMiddleware, (req, res) => {
    console.log('about');
    res.send('About Page')
}); */

if ( process.env.NODE_ENV == "production" ) {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port, () => {
    console.log(`listening on port http://localhost:5000`);
});