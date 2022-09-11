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
 * /getinvoice_line:
 *   get:
 *     summary: gets a list of all the invoice_line objects from the database
 *     responses:
 *       200:
 *         description: list of invoice_line objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// getting all the invoice lines
router.get("/getinvoice_line", upload.single("file"), (req, res) => {
  db.query("select * from invoice_line", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    })
});

/**
 * @swagger
 * /createinvoice_line:
 *   post:
 *     summary: Creates or updates an invoice_line from the database
 *     responses:
 *       200:
 *         description: values created or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// creating an invoice line 
router.post("/createinvoice_line", upload.single("file"), async(req, res) => {
  const quantity = req.body.quantity;
  const line_price = req.body.line_price;
  if (req.body.id === "") {
    db.query("INSERT INTO invoice_line (quantity, line_price) VALUES (?,?)", [quantity, line_price], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    });
  } else if (req.body.id !== "") {
    const id = req.body.id;
    db.query("UPDATE invoice_line SET quantity = ?, line_price = ? WHERE item_id = ?;", [quantity, line_price, id], (err, result) => {
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
 * /deleteinvoice_line:
 *   post:
 *     summary: Deletes an invoice_line from the database
 *     responses:
 *       200:
 *         description: values Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// deleting an invoice line 
router.post("/deleteinvoice_line", upload.single("file"), (req, res) => {
  const id = req.body.id;
  db.query("delete from invoice_line where item_id = ?", [id], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      res.send("Values deleted");
    }
  });
});



module.exports = router;
