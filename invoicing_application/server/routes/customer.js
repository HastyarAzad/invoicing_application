
// this containg all the routs for customer module


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
 * /getcustomer:
 *   get:
 *     summary: Returns the list of all the customers
 *     responses:
 *       200:
 *         description: The list of the customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
//getting all customers
router.get("/getcustomer", upload.single("file"), (req, res) => {
  db.query("select * from customer", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
});

/**
 * @swagger
 * /createcustomer:
 *   post:
 *     summary: Creates or updates a Customer and inserts it into the database
 *     responses:
 *       200:
 *         description: values updated or created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// 
// creating a customer
router.post("/createcustomer", upload.single("file"), (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const address = req.body.address;
  const phone = req.body.phone;
  const balance = req.body.balance;
  if (req.body.id === "") {
    db.query("INSERT INTO customer (first_name, last_name, address, phone, balance) VALUES (?,?,?,?,?)", [first_name, last_name, address, phone, balance], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    });
  } else if (req.body.id !== "") {
    const id = req.body.id;
    db.query("UPDATE customer SET first_name = ?, last_name = ?, address = ?, phone = ?, balance = ? WHERE id = ?;", [first_name, last_name, address, phone, balance, id], (err, result) => {
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
 * /deletecustomer:
 *   post:
 *     summary: Deletes a customer from the database 
 *     responses:
 *       200:
 *         description: values deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// deleting a customer
router.post("/deletecustomer", upload.single("file"), (req, res) => {
  const id = req.body.id;
  db.query("delete from customer where id = ?", [id], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      res.send("Values deleted");
    }
  });
});
module.exports = router;