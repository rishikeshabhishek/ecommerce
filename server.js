const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');

const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const adminAuth = require("./middlewares/adminAuth");
const userAuth = require("./middlewares/userAuth");

const session = require("express-session");

app.use(session({
    cookie: {
        maxAge: 60000
    },
    secret: "abhishek23",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(cookieParser());

//urlencoded
app.use(express.urlencoded({
    extended: true
}));


app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

// declare db connection
const dbDriver = "mongodb+srv://abhishek:rKbKhmexljtap0Rh@cluster0.jwma6.mongodb.net/ecommerce";

app.use(adminAuth.authJwt);
app.use(userAuth.authJwt);
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
app.use("/admin", adminRouter);
app.use(userRouter);
app.locals._ = _;

const port = process.env.PORT || 1998;

mongoose.connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result => {
    app.listen(port, () => {
        console.log(`DB Is Connected`);
        console.log(`Server Is Connected!!! @ http://localhost:${port}/`);
    });
}).catch(error => {
    console.log(error);
});