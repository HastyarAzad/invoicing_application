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
 * /getinvoice:
 *   get:
 *     summary: gets a list of all the invoice objects from the database
 *     responses:
 *       200:
 *         description: list of invoice objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// getting all the invoices
router.get("/getinvoice", upload.single("file"), (req, res) => {
  db.query("select * from invoice", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

/**
 * @swagger
 * /deleteinvoice:
 *   post:
 *     summary: Deletes an invoice from the database
 *     responses:
 *       200:
 *         description: values Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// deleting an invoice 
router.post("/deleteinvoice", upload.single("file"), (req, res) => {
  const id = req.body.id;
  db.query("delete from invoice where id = ?", [id], (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      res.send("Values deleted");
    }
  });
});

// generating a new id based on the last input inside the database 
// then returning it
function generate_id(id) {
  let number = parseInt(id.slice(id.indexOf("-") + 1, id.length)) + 1;
  let year = parseInt(id.slice(0, id.indexOf("-")));
  let date = new Date().getFullYear();
  if (date == year) {
    if (number < 10) {
      return (`${date}-000${number}`)
    } else if (number < 100) {
      return (`${date}-00${number}`)
    } else if (number < 1000) {
      return (`${date}-0${number}`)
    } else {
      return (`${date}-${number}`)
    }
  } else {
    return (`${date}-0000`)
  }
}

// creating an id if the table was empty
function create_id() {
  let date = new Date().getFullYear();
  date = date + '-0001';
  return date;
}

// getting the last id inside invoice table
function get_id() {
  return new Promise((resolve, reject) => {
    db.query("SELECT id FROM invoice ORDER BY id DESC LIMIT 1;", (err, result) => {
      if (err) {
        reject(err)
      } else {
        if (result[0] === undefined) {
          const id = create_id();
          resolve(id)
        } else {
          const id = generate_id(result[0].id)
          resolve(id)
        }
      };
    })
  });
}

// checking the customer balance, wether it's enough for the invoice total or not
function check_customer_balance(invoice_total, customer_id) {
  return new Promise((resolve, reject) => {
    db.query("select balance from customer where id = ?", [customer_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result[0].balance >= invoice_total) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  });
}

// checking if the product is available in stock
function check_quantity_on_hand(product_id) {
  return new Promise((resolve, reject) => {
    db.query("select quantity_on_hand from product where id = ?", [product_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result[0].quantity_on_hand > 0) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  });
}

// reducing the customer's balance after creating the invoice 
async function reduce_balance(invoice_total, customer_id) {
  let balance = await new Promise((resolve, reject) => {
    db.query("select balance from customer where id = ?", [customer_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].balance);
      }
    });
  });
  balance = balance - invoice_total;
  return new Promise((resolve, reject) => {
    db.query("UPDATE customer SET balance = ? WHERE id = ?;", [balance, customer_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
}

/**
 * @swagger
 * /createinvoice:
 *   post:
 *     summary: Creates or updates an invoice from the database
 *     responses:
 *       200:
 *         description: values created or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

// creating an invoice 
router.post("/createinvoice", upload.single("file"), async(req, res) => {
  const date = req.body.date;
  const customer = req.body.customer;
  const invoice_total = req.body.invoice_total;
  const invoice_line = req.body.invoice_line;
  const product = req.body.product;
  if (req.body.id === "") {  // we are creating a new invoice
    // check customer balance
    // check quantity on hand
    const is_balance_sufficient = await check_customer_balance(invoice_total, customer) // checking customer balance
    const is_quantity_sufficient = await check_quantity_on_hand(product) // checking quantity on hand
    if (is_balance_sufficient && is_quantity_sufficient) {
      const id = await get_id();
      db.query("INSERT INTO invoice (id, date, customer, invoice_total, invoice_line, product) VALUES (?,?,?,?,?,?)", [id, date, customer, invoice_total, invoice_line, product], async(err, result) => {
        if (err) {
          console.log(err);
        } else {
          // reduce customer balance 
          await reduce_balance(invoice_total, customer);
          res.send("Values Inserted");
        }
      });
    } else {
      res.send("insufficient balance")
    }
  } else if (req.body.id !== "") { // we are updating an invoice
    const id = req.body.id;
    db.query("UPDATE invoice SET date = ?, customer = ?, invoice_total = ?, invoice_line = ? WHERE id = ?;", [date, customer, invoice_total, invoice_line, id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    });
  }
});


module.exports = router;