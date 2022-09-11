const express = require("express");
const router = express.Router();
var multer = require('multer');
var fs = require('fs');
var db = require('../db');

// accessing the ../images route using mutler
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

/**
 * @swagger
 * /getproduct:
 *   get:
 *     summary: gets a list of all the product objects from the database
 *     responses:
 *       200:
 *         description: list of product objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// getting all the products from the DB
router.get("/getproduct", upload.single("file"), (req, res) => {
  db.query("select * from product", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        for (let i = 0; i < result.length; i++) {
          let imageAsBase64 = fs.readFileSync(`${result[i].product_image}`, 'base64');
          result[i].product_image = imageAsBase64;
        }
        res.send(result);
      }
    })
});

/**
 * @swagger
 * /createproduct:
 *   post:
 *     summary: Creates or updates a product from the database
 *     responses:
 *       200:
 *         description: values created or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
// creating a new product 
router.post("/createproduct", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const barcode = req.body.barcode;
  const quantity_on_hand = req.body.quantity_on_hand;
  const price = req.body.price;
  const suplier = req.body.suplier;
  const file_location = `${req.file.destination}/${req.file.filename}` // saving the generated image route inside the Database

  if (req.body.id === "") {// if there is no id, we are creating a new product
    db.query("INSERT INTO product (name, barcode, quantity_on_hand, price, suplier, product_image) VALUES (?,?,?,?,?,?)", [name, barcode, quantity_on_hand, price, suplier, file_location], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    });
  } else if (req.body.id !== "") { // if there is an id, we are updating an existing one
    const id = req.body.id;
    db.query("UPDATE product SET name = ?, barcode = ?, quantity_on_hand = ?, price = ?, suplier = ?, product_image = ? WHERE id = ?;", [name, barcode, quantity_on_hand, price, suplier, file_location, id], (err, result) => {
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
 * /deleteproduct:
 *   post:
 *     summary: Deletes a product from the database and ./images folder
 *     responses:
 *       200:
 *         description: values Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

// deleting a product
router.post("/deleteproduct", upload.single("file"), async(req, res) => {
  const id = req.body.id;
  let product_image_url = '';

  // getting the image route before deleting the product
  db.query("select product_image from product where id = ?", [id], (err, result) => {
    if (err) {
      req.send("image not found")
    } else {
      product_image_url = result[0].product_image;
    }
  });

  // deleting the product
  db.query("delete from product where id = ?", [id], async (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      await delete_file(product_image_url); // deleting the associated file 
      res.send("Values deleted");
    }
  });
});

// deleting the image inside ../images route
function delete_file(product_image_url) {
  return new Promise((resolve, reject) => {
    fs.rm(product_image_url, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve('file deleted')
      }
    })
  });
}


module.exports = router;