import React, { Component } from "react";
import Input_form from "../../components/input_form/Input_form";
import Table from "../../components/table/Table";
import "./Product.scss";
import api from "../../services/api";

class Product extends Component {
  state = {
    update_object: {// this holds the data we want to update
      type: "",
    },
    product_tableHead: [
      // the product table columns
      "id",
      "name",
      "barcode",
      "quantity on hand",
      "price",
      "suplier",
      "image",
    ],
    product_tableBody: [], // product table body
    suplier_tableHead: ["id", "name", "phone number"], // suplier table head
    suplier_tableBody: [], // suplier table body

    product_form_structure: [
      // we define the form structure
      {
        name: "id",
        type: "text",
        id: "id",
        place_holder: "Product id...",
      },
      {
        name: "name",
        type: "text",
        id: "name",
        place_holder: "Product name...",
      },
      {
        name: "barcode",
        type: "number",
        id: "barcode",
        place_holder: "Barcode...",
      },
      {
        name: "quantity on hand",
        type: "number",
        id: "quantity_on_hand",
        place_holder: "Quantity...",
      },
      {
        name: "price",
        type: "number",
        id: "price",
        place_holder: "Product price...",
      },
      {
        name: "suplier",
        type: "select",
        id: "suplier",
        default: "Suplier...",
        values: [],
      },
      {
        name: "choose image",
        type: "file",
        id: "file",
        place_holder: "add file...",
      },
    ],
    suplier_form_structure: [
      // we define the form structure
      {
        name: "id",
        type: "text",
        id: "id",
        place_holder: "Suplier id",
      },
      {
        name: "name",
        type: "text",
        id: "name",
        place_holder: "Suplier name",
      },
      {
        name: "phone number",
        type: "number",
        id: "phone_number",
        place_holder: "07701777806",
      },
    ],
  };

  // getting all the products from the database
  async get_product_table_body() {
    const response = await api.get("product"); // making an api request

    const list = response.data.map((item, index) => {
      // mapping all the rows
      let values = Object.values(item); // extracting the values
      let keys = Object.keys(item); // extracting the keys
      let properties = [];
      for (let i = 0; i < values.length; i++) {
        if (keys[i] === "product_image") {
          // if we have an image, create an image with the following attributes
          properties.push(
            <img
              alt="img"
              src={`data:image/jpeg;base64,${values[i]}`} // we are getting the image as base64 from the backend
              className="img"
              width={70}
              height={40}
            />
          );
        } else {
          properties.push(`${values[i]}`);
        }
      }
      return { id: `${index + 1}`, value: properties };
    });
    this.setState({ product_tableBody: list, update_object: {} }); // updating the state
  }

  // getting all the supliers from the database
  async get_suplier_table_body() {
    const response = await api.get("suplier"); // requesting to the bacend using our api, and waiting for the response

    const list = response.data.map((item, index) => {
      return { id: `${index + 1}`, value: Object.values(item) }; // mapping each data to an object containing an id and the value
    });
    this.setState({ suplier_tableBody: list, update_object: {} });

    this.get_suplier_ids(response);
  }

  // getting all the id's and updating the state
  get_suplier_ids(response) {
    const values = response.data.map((item, index) => {
      return { id: `${index + 1}`, value: Object.values(item) };
    });

    let list = [];
    for (let i = 0; i < values.length; i++) {
      list.push(values[i].value[0]);
    }
    const product_form_structure = this.state.product_form_structure;
    product_form_structure[5].values = list;
    this.setState({ product_form_structure });
  }

  // deleting a product from database and table
  handleProductDelete = async (id, db_id) => {
    const response = await api.remove("product", { id: db_id });
    if (response.status === 200) {
      const product_tableBody = this.state.product_tableBody.filter(
        (item) => item.id !== id
      );
      this.setState({ product_tableBody });
    }
  };

  // deleting a suplier from database and table
  handleSuplierDelete = async (id, db_id) => {
    const response = await api.remove("suplier", { id: db_id });
    if (response.status === 200) {
      const suplier_tableBody = this.state.suplier_tableBody.filter(
        (item) => item.id !== id
      );
      this.setState({ suplier_tableBody });
    }
  };

  // setting the update_object
  handleProductEdit = (id) => {
    let item = this.state.product_tableBody.filter((item) => item.id === id);
    let foundItem = item[0];
    foundItem.type = "product";

    // update the update_object
    this.setState({ update_object: foundItem });
  };

  // setting the update_object
  handleSuplierEdit = (id) => {
    let item = this.state.suplier_tableBody.filter((item) => item.id === id);
    let foundItem = item[0];
    foundItem.type = "suplier";
    // update the update_object
    this.setState({ update_object: foundItem });
  };

  // re-rendering the tables after update or delete operation
  refresh = () => {
    this.get_product_table_body();
    this.get_suplier_table_body();
  };
  
// getting all the data from the database after the component mounts
  componentDidMount() {
    this.get_product_table_body();
    this.get_suplier_table_body();
  }

  render() {
    // de-constructing our state object
    const {
      product_tableHead,
      product_tableBody,
      product_form_structure,
      suplier_form_structure,
      suplier_tableHead,
      suplier_tableBody,
      update_object,
    } = this.state;
    return (
      <React.Fragment>
        <div className="main_container">
          <div className="input">
            <div className="inputs">
              <h3>Add Product</h3>
              <Input_form
                form_structure={product_form_structure} // passing the form structure
                update_object={update_object} // passing the update object
                type="product"
                refresh={this.refresh} // handling refresh
              />
            </div>
            <div className="inputs">
              <h3>Add Suplier</h3>
              <Input_form
                form_structure={suplier_form_structure} // passing the form structure
                update_object={update_object} // passing the update object
                type="suplier"
                refresh={this.refresh} // handling refresh
              />
            </div>
          </div>
          <div className="table">
            <div className="first_table">
              <Table
                tableHead={product_tableHead} // passing tablehead
                tableBody={product_tableBody} // passing tablebody
                handleDelete={this.handleProductDelete} // handling delete operation
                handleEdit={this.handleProductEdit} // handling edit operation
              />
            </div>
            <div className="second_table">
              <Table
                tableHead={suplier_tableHead} // passing tablehead
                tableBody={suplier_tableBody} // passing tablebody
                handleDelete={this.handleSuplierDelete} // handling delete operation
                handleEdit={this.handleSuplierEdit} // handling edit operation
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Product;
