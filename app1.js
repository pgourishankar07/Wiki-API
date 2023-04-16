// _____________________________PACKAGES____________________________________

const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// _____________________________APP setup____________________________________

const app = express();

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));

// _____________________________DB setup____________________________________

mongoose.connect("mongodb://localhost:27017/wikiDB");

//creating a strucure of the collection

const artSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const arts = mongoose.model("articles", artSchema); //creating collection(moel)

// _____________________________GET____________________________________

app.get("/articles", (req, res) => {
  //   arts.find({}, (err, data) => {
  //     if (!err) console.log(data);
  //   });

  //this is new version of mongoose so use like this instead of above type

  arts
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

// _____________________________POST____________________________________

app.post("/articles", (req, res) => {
  const newArt = new arts({
    title: req.body.title,
    content: req.body.content,
  });
  //   newArt.save((err) => {
  //     if (!err) console.log("added");
  //     else console.log(err);
  //   });

  //instead of above line write the below line bcoz latest version of mongoose dont accept callback

  newArt
    .save()
    .then((data) => {
      console.log("Successfully added new Article");
    })
    .catch((err) => {
      console.error(err);
    });
});

// _____________________________DELETE____________________________________

app.delete("/articles", (req, res) => {
  arts
    .deleteMany()
    .then((data) => {
      res.send("Successfully Deleted all articles");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(3000, () => {
  console.log("Server has started");
});
