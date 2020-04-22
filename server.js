const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const mongojs = require("mongojs");
const User = require("./models/userModel.js");
const app = express();
const axios = require('axios');

const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()); // Make sure it comes back as json
app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/workoutDb", {
  useUnifiedTopology: true, //take away depreciated server issue
  useNewUrlParser: true
}
);

mongoose.Promise = global.Promise; //Es6 Promise. take away depreciated Promise issue

//path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});
//-----------------------------------------

app.post("/submit", ({ body }, res) => {
  const user = new User(body);
  user.lastUpdatedDate();

  User.create(user)
    .then(dbUser => {
      res.json(dbUser); //*********This is the Devil caused me stuck */
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/all", (req, res) => {
  User.find({}, (err, data) => {
    res.json(data);
  });
});

app.get("/find/:id", (req, res) => {
  User.findOne({
    _id: mongojs.ObjectId(req.params.id)
  },
    (err, data) => {
      res.json(data);
    }
  );
});

app.post("/update/:id", (req, res) => {
  User.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        trail: req.body.trail,
        note: req.body.note,
        modified: Date.now()
      }
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});


module.exports = app;

/*
----//controller--------
let express = require('express');
let router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.send('Mountain Biking Tracker');
  module.exports = router;
}) */

/* var homePage = require('./index.js');
// ...
app.use('/index.js', homePage);
 */






/* app.get("/myplan.html", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.post("/submit", ({ body }, res) => {
  const user = new User(body);
  user.lastUpdatedDate();

  User.create(user)
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
}); */








/*
const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl = "notetaker";
const collections = ["notes"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

app.get("/", (req, res) => {
  res.send(index.html);
});

// TODO: You will make six more routes. Each will use mongojs methods
// to interact with your mongoDB database, as instructed below.
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/

// 1. Save a note to the database's collection
// POST: /submit
// ===========================================
app.post("/submit", (req, res) => {
  db.notes.insert(req.body, function(err, data) {
    res.json(data);
  });
});

// 2. Retrieve all notes from the database's collection
// GET: /all
// ====================================================
app.post("/all", (req, res) => {
  db.notes.find({}, function(err, data) {
    res.json(data);
  });
});
// 3. Retrieve one note in the database's collection by it's ObjectId
// TIP: when searching by an id, the id needs to be passed in
// as (mongojs.ObjectId(IdYouWantToFind))
// GET: /find/:id
// ==================================================================
app.get("/find/:id", (req, res) => {
  db.notes.findOne({ _id: mongojs.ObjectId(req.params.id) }, function(err,data) {
    res.json(data);
  });
});
// 4. Update one note in the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IdYouWantToFind)
// POST: /update/:id
// ================================================================
app.put("/update/:id", (req, res) => {
  db.notes.update(
    { _id: mongojs.ObjectId(req.params.id) },
    { $set: { title: req.body.title, note: req.body.note } },
    function(err, data) {
      res.json(data);
    }
  );
});
// 5. Delete one note from the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IdYouWantToFind)
// DELETE: /delete/:id
// ==================================================================
app.delete("/delete/:id", (req, res) => {
  db.notes.remove({ _id: mongojs.ObjectId(req.params.id) }, function(
    err,
    data
  ) {
    res.json(data);
  });
});
// 6. Clear the entire note collection
// DELETE: /clearall
// ===================================
app.delete("/clearall", (req, res) => {
  db.notes.remove({}, function(err, data) {
    res.json(data);
  });
});
// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});
 */
