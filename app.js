// <<<--- Imports --->>>
// Express and Web
const express = require('express');
const app = express();
const port = 3000;
// Database (MongoDB)
const mongoose = require('mongoose');
// Countries
const { countries } = require('countries-list');
// to use time
var moment = require('moment');
// to delete data
var methodOverride = require('method-override')
app.use(methodOverride('_method'))

// <<<--- .html => .ejs --->>>
app.set('view engine', 'ejs');
// <<<--- any (style, image, js) in the public folder --->>>
app.use(express.static('public'));
// <<<--- Parse URL-encoded bodies (e.g., form submissions) --->>>
app.use(express.urlencoded({ extended: true }));

// <<<--- Database (Mongo) --->>>
// info
const username = "omarzcode";
const password = "rNqHx1DKznIlGs2J";
//main
mongoose.connect(`mongodb+srv://${username}:${password}@nodex.r1gzo4w.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(port, () => {
            console.log(`Your app is running on: http://localhost:${port}/users`);
            console.log(`MongoDB connection established successfully`);
        });
    })
    .catch((err) => {
        console.error(err);
        console.log("Database Error");
    });


// <<<--- Routes --->>>
// info
const Customer = require("./models/customerSchema");
const app_name = "nodex";
// main
// --all Users
app.get('/users', (req, res) => {
    Customer.find().then((result) => {
        console.log("======================================")
        console.log(result)
        res.render("index", { project_name: `${app_name}`, array: result, moment: moment });
    }).catch((err) => {
        console.log("you have error")
        console.log(err)

    })
});

// --Add User
app.get('/user/add', (req, res) => {
    res.render("user/add", { countries: Object.values(countries), project_name: `${app_name}` });
});

// --Create Users add to home page
app.post('/users', (req, res) => {
    console.log(req.body);
    Customer.create(req.body)
        .then(() => {
            res.redirect("/users");
        })
        .catch((err) => {
            console.error(err);
        });
});

// --View User
app.get('/user/:id', (req, res) => {
    Customer.findById(req.params.id)
        .then((result) => {
            console.log("=================================");
            console.log(result);
            res.render("user/view", { object: result, moment: moment, project_name: `${app_name}` });
        }).catch((err) => {
            console.log(err);
        })
});

// --Edit User
app.get('/edit/:id', (req, res) => {
    Customer.findById(req.params.id)
        .then((result) => {
            res.render("user/edit", { object: result, countries: Object.values(countries), project_name: `${app_name}` });
        }).catch((err) => {
            console.log(err)
        })
});

// PUT Method
app.put('/edit/:id', (req, res) => {
    console.log(req.body)
    Customer.updateOne({ _id: req.params.id }, req.body)
        .then((params) => {
            res.redirect("/users")
        }).catch((err) => {
            console.log(err)
        })
});
// Delete Method
app.delete("/delete/:id", (req, res) => {
    Customer.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/users");
        }).catch((err) => {
            console.log(err)
        })
}); 