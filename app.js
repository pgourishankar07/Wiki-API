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

app
  .route("/articles")

  // _____________________________GET____________________________________

  .get((req, res) => {
    arts
      .find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.error(err);
      });
  })

  // _____________________________POST____________________________________

  .post((req, res) => {
    const newArt = new arts({
      title: req.body.title,
      content: req.body.content,
    });

    newArt
      .save()
      .then((data) => {
        console.log("Successfully added new Article");
        res.send("Successfully added new Article");
      })
      .catch((err) => {
        console.error(err);
      });
  })

  // _____________________________DELETE____________________________________

  .delete((req, res) => {
    arts
      .deleteMany()
      .then((data) => {
        res.send("Successfully Deleted all articles");
      })
      .catch((err) => {
        console.error(err);
      });
  });

// ________________________Finding specific one ___________________

app
  .route("/articles/:page")
  .get((req, res) => {
    arts
      .findOne({ title: req.params.page })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.error("No Article found on that name ....:(", err);
        res.status(404).send("No article found with that title");
      });
  })

  // ________________________Updating specific one with all of its value___________________

  .put((req, res) => {
    arts.update(
      { title: req.params.page },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated");
        }
      }
    );
  })

  // ________________________Updating specific one with specific value ___________________

  .patch((req, res) => {
    arts.update({ title: req.params.page }, { $set: req.body }, (err) => {
      if (!err) res.send("successfully updated...");
      else res.send(err);
    });
  })

  // ________________________Deleting a specific one  ___________________

  .delete((req, res) => {
    arts.deleteOne({ title: req.params.page }, (err) => {
      if (!err) res.send("Successssfully deleted.. the corresponding record");
      else req.send(err);
    });
  });

app.listen(3000, () => {
  console.log("Server has started");
});
