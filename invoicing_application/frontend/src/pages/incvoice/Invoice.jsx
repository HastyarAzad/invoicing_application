import React, { Component } from "react";
import Input_form from "../../components/input_form/Input_form";
import Table from "../../components/table/Table";
import "./Invoice.scss";
import api from "../../services/api";

class Invoice extends Component {
  state = {
    update_object: {   // this holds the data we want to update
      type: "",
    },
    invoice_tableHead: [ // the invoice table columns 
      "id",
      "date",
      "customer",
      "invoice total",
      "invoice line",
      "product",
    ],
    invoice_tableBody: [],// invoice table body
    invoice_line_tableHead: ["id", "quantity", "price"],// invoice_line table head
    invoice_line_tableBody: [],// invoice_line table body

    invoice_form_structure: [ // we define the form structure 
      { name: "id", type: "text", id: "id", place_holder: "Invoice id..." },
      { name: "date", type: "date", id: "date", place_holder: "Pick date" },
      {
        name: "customer",
        type: "select",
        id: "customer",
        default: "Select Customer...",
        values: [],
      },
      {
        name: "invoice total",
        type: "number",
        id: "invoice_total",
        place_holder: "Invoice total...",
      },
      {
        name: "invoice line",
        type: "select",
        id: "invoice_line",
        default: "Invoice Line...",
        values: [],
      },
      {
        name: "product",
        type: "select",
        id: "product",
        default: "product...",
        values: [],
      },
    ],
    invoice_line_form_structure: [// we define the form structure
      {
        name: "id",
        type: "text",
        id: "id",
        place_holder: "Invoice line id",
      },
      {
        name: "Quantity",
        type: "number",
        id: "quantity",
        place_holder: "Quantity",
      },
      {
        name: "Line Price",
        type: "number",
        id: "line_price",
        place_holder: "Line Price",
      },
    ],
  };

  // getting all the customers from the database 
  async get_customers() {
    const response = await api.get("customer"); // requesting to the bacend using our api, and waiting for the response

    const values = response.data.map((item, index) => {
      return { id: `${index + 1}`, value: Object.values(item) };  // mapping each data to an object containing an id and the value
    });

    let list = [];
    for (let i = 0; i < values.length; i++) {
      list.push(values[i].value[0]); // pushing all the ids into the list
    }
    const invoice_form_structure = this.state.invoice_form_structure;
    invoice_form_structure[2].values = list;
    this.setState({ invoice_form_structure }); // updating the state object
  }

  // getting all the products 
  async get_products() {
    const response = await api.get("product"); // making an api request
    const values = response.data.map((item, index) => {
      return { id: `${index + 1}`, value: Object.values(item) };  // mapping every row to an object
    });

    let list = [];
    for (let i = 0; i < values.length; i++) {
      list.push(values[i].value[0]); // pushing all the ids into the list
    }
    const invoice_form_structure = this.state.invoice_form_structure;
    invoice_form_structure[5].values = list;
    this.setState({ invoice_form_structure }); // updating the state
  }

  // getting invoice_line's table body
  async get_invoice_line_table_body() {
    const response = await api.get("invoice_line"); // making an api request
    this.process_invoice_line_response(response); // passing data to be processed
    this.get_invoice_line_ids(response);  // passing data to be processed
  }

  // processing the data and updating the state
  process_invoice_line_response(response) {
    const list = response.data.map((item, index) => {
      let values = Object.values(item);
      return { id: `${index + 1}`, value: values };
    });

    this.setState({ invoice_line_tableBody: list, update_object: {} });
  }

  // getting all the id's and updating the state
  get_invoice_line_ids(response) {
    const values = response.data.map((item, index) => {
      return { id: `${index + 1}`, value: Object.values(item) };
    });

    let list = [];
    for (let i = 0; i < values.length; i++) {
      list.push(values[i].value[0]);
    }
    const invoice_form_structure = this.state.invoice_form_structure;
    invoice_form_structure[4].values = list;
    this.setState({ invoice_form_structure });
  }

  // getting invoice table body and updating the state
  async get_invoice_table_body() {
    const response = await api.get("invoice");
    const list = response.data.map((item, index) => {
      let values = Object.values(item);
      values[1] = values[1].slice(0, 10);
      return { id: `${index + 1}`, value: values };
    });
    this.setState({ invoice_tableBody: list, update_object: {} });
  }

  // deleting an invoice from database and table
  handleInvoiceDelete = async (id, db_id) => {
    const response = await api.remove("invoice", { id: db_id });
    if (response.status === 200) {
      const invoice_tableBody = this.state.invoice_tableBody.filter(
        (item) => item.id !== id
      );
      this.setState({ invoice_tableBody });
    }
  };
  // deleting an invoice_line from database and table
  handleInvoiceLineDelete = async (id, db_id) => {
    const response = await api.remove("invoice_line", {id:db_id})
    if (response.status === 200) {
      const invoice_line_tableBody = this.state.invoice_line_tableBody.filter(
        (item) => item.id !== id
      );
      this.setState({ invoice_line_tableBody });
    }
  };

  // setting the update_object 
  handleInvoiceEdit = (id) => {
    let item = this.state.invoice_tableBody.filter((item) => item.id === id);// finding the table row acording to the id 
    let foundItem = item[0];
    foundItem.type = "invoice";
    // update the update_object
    this.setState({ update_object: foundItem });
  };
  // setting the update_object 
  handleInvoiceLineEdit = (id) => {
    let item = this.state.invoice_line_tableBody.filter(// finding the table row acording to the id 
      (item) => item.id === id
    );
    let foundItem = item[0];
    foundItem.type = "invoice_line";
    // update the update_object
    this.setState({ update_object: foundItem });
  };

  // re-rendering the tables after update or delete operation 
  refresh = () => {
    this.get_invoice_table_body();
    this.get_invoice_line_table_body();
  };
  
  // getting all the data from the database after the component mounts
  componentDidMount() {
    this.get_invoice_line_table_body();
    this.get_invoice_table_body();
    this.get_customers();
    this.get_products();
  }

  render() {
    // de-constructing our state object
    const {
      invoice_tableHead,
      invoice_tableBody,
      invoice_form_structure,
      invoice_line_form_structure,
      invoice_line_tableHead,
      invoice_line_tableBody,
      update_object
    } = this.state;
    return (
      <React.Fragment>
        <div className="main_container">
          <div className="input">
            <div className="inputs">
              <h3>Add Invoice</h3>
              <Input_form
                form_structure={invoice_form_structure} // passing the form structure
                update_object={update_object} // passing the update object
                type="invoice"
                refresh={this.refresh} // handling refresh
              />
            </div>
            <div className="inputs">
              <h3>Add Invoice Line</h3>
              <Input_form
                form_structure={invoice_line_form_structure}  // passing the form structure
                update_object={update_object} // passing the update object
                type="invoice_line"
                refresh={this.refresh} // handling refresh
              />
            </div>
          </div>

          <div className="table">
            <div className="first_table">
              <Table
                tableHead={invoice_tableHead} // passing tablehead
                tableBody={invoice_tableBody} // passing tablebody
                handleDelete={this.handleInvoiceDelete} // handling delete operation
                handleEdit={this.handleInvoiceEdit} // handling edit operation
              />
            </div>
            <div className="second_table">
              <Table
                tableHead={invoice_line_tableHead} // passing tablehead
                tableBody={invoice_line_tableBody} // passing tablebody
                handleDelete={this.handleInvoiceLineDelete} // handling delete operation
                handleEdit={this.handleInvoiceLineEdit} // handling edit operation
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Invoice;
