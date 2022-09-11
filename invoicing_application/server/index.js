const express = require("express");
const cors = require("cors");
const customer = require("./routes/customer")
const invoice_line = require("./routes/invoice_line")
const suplier = require("./routes/suplier")
const product = require("./routes/product")
const invoice = require("./routes/invoice")
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


// starting the server
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/',customer);
app.use('/',suplier);
app.use('/',invoice_line);
app.use('/',invoice);
app.use('/',product);

// setting up and using swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Invoicing API",
      description: "Invoicing API Information",
      contact: {
        name: "Hastyar Azad"
      },
      servers: ["http://localhost:5000"]
    }
  },
  // ['.routes/*.js']
  apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// listening on PORT or 3001          
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("listening on: ", PORT));