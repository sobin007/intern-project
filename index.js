const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Sentry = require('@sentry/node')
var useragent = require('express-useragent');
var nodemailer = require('nodemailer');
const Tracing = require("@sentry/tracing");
let app = express();

///////route file declaration//////////
const userRoute = require('./Routes/userRoute')

app.use(bodyParser.urlencoded({
    extended: true, limit: '150mb'
}));
app.use(bodyParser.json({ limit: '150mb' }));


mongoose.connect(process.env.MONGOURL || 'mongodb+srv://ajomon:ajomon123@cluster0.3njcf.mongodb.net/sampleproject?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    // if(data)
    //     console.log("db success", data)
    // if(error)
    //     console.log("db error", error)
    console.log("Db connected")
}).catch((ex) => {
    console.log("Db connection error")
    console.log(ex)
});

Sentry.init({
    dsn: "https://a02c8ba218dc48bd9bbba2480c6c91b2@o1167035.ingest.sentry.io/6257705",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
});

setTimeout(() => {
    try {
        foo();
    } catch (e) {
        Sentry.captureException(e);
    } finally {
        transaction.finish();
    }
}, 99);


var db = mongoose.connection;

var port = process.env.PORT || 4007;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());
app.use(helmet());

app.use(useragent.express());
app.use((req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)
    next();
})

///app.use()
app.use(userRoute)


const server = app.listen(port, function () {
    console.log("Running Server on port " + port);
});