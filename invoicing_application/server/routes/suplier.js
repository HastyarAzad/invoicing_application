const express = require("express");
const router = express.Router();
var multer = require('multer');
var fs = require('fs');
var db = require('../db');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../images"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

/**
 * @swagger
 * /getsuplier:
 *   get:
 *     summary: gets a list of all the suplier objects from the database
 *     responses:
 *       200:
 *         description: list of suplier objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

// getting all the supliers
router.get("/getsuplier", upload.single("file"), (req, res) => {
  db.query("select * from suplier", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    })
});

/**
 * @swagger
 * /createsuplier:
 *   post:
 *     summary: Creates or updates a suplier from the database
 *     responses:
 *       200:
 *         description: values created or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

// creating a suplier record inside the database
router.post("/createsuplier", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const phone_number = req.body.phone_number;
  if (req.body.id === "") {
    db.query("INSERT INTO suplier (name, phone) VALUES (?,?)", [name, phone_number], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    });
  } else if (req.body.id !== "") {
    const id = req.body.id;
    db.query("UPDATE suplier SET name = ?, phone = ? WHERE id = ?;", [name, phone_number, id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    });
  }
});

/**
 * @swagger
 * /deletesuplier:
 *   post:
 *     summary: Deletes a suplier from the database
 *     responses:
 *       200:
 *         description: values Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

// deleting a suplier
router.post("/deletesuplier", upload.single("file"), (req, res) => {
  const id = req.body.id;
  db.query("delete from suplier where id = ?", [id], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      res.send("Values deleted");
    }
  });
});

module.exports = router;