import React, { Component } from "react";
import Input_form from "../../components/input_form/Input_form";
import Table from "../../components/table/Table";
import "./Customer.scss";
import api from "../../services/api";

class Customer extends Component {
  state = {
    update_object: {
      // this holds the data we want to update
      type: "",
    },
    customer_tableHead: [
      // the customer table columns
      "id",
      "first name",
      "last name",
      "address",
      "phone",
      "balance",
    ],
    customer_tableBody: [], // customer table body

    customer_form_structure: [
      // we define the form structure
      {
        name: "id",
        type: "text",
        id: "id",
        place_holder: "Customer id...",
      },
      {
        name: "first name",
        type: "text",
        id: "first_name",
        place_holder: "Customer name...",
      },
      {
        name: "last name",
        type: "text",
        id: "last_name",
        place_holder: "Last name...",
      },
      {
        name: "address",
        type: "text",
        id: "address",
        place_holder: "Address...",
      },
      {
        name: "phone",
        type: "text",
        id: "phone",
        place_holder: "Phone number...",
      },
      {
        name: "balance",
        type: "number",
        id: "balance",
        place_holder: "Balance...",
      },
    ],
  };

  // getting all the customers from the database
  async get_customer_table_body() {
    const response = await api.get("customer"); // requesting to the bacend using our api, and waiting for the response
    const list = response.data.map((item, index) => {
      let values = Object.values(item);
      return { id: `${index + 1}`, value: values }; // mapping each data to an object containing an id and the value
    });

    this.setState({ customer_tableBody: list, update_object: {} });
  }

  // deleting a customer from database and table
  handleCustomerDelete = async (id, db_id) => {
    const response = await api.remove("customer", { id: db_id });
    if (response.status === 200) {
      const customer_tableBody = this.state.customer_tableBody.filter(
        (item) => item.id !== id
      );
      this.setState({ customer_tableBody });
    }
  };

  // setting the update_object
  handleCustomerEdit = (id) => {
    let item = this.state.customer_tableBody.filter((item) => item.id === id);
    let foundItem = item[0];
    foundItem.type = "customer";
    // update the update_object
    this.setState({ update_object: foundItem });
  };

  // getting all the data from the database after the component mounts
  componentDidMount() {
    this.get_customer_table_body();
  }

  // re-rendering the tables after update or delete operation
  refresh = () => {
    this.get_customer_table_body();
  };

  render() {
    // de-constructing our state object
    const {
      customer_tableHead,
      customer_tableBody,
      customer_form_structure,
      update_object,
    } = this.state;

    return (
      <React.Fragment>
        <div className="main_container">
          <div className="input">
            <div className="inputs">
              <h3>Add Customer</h3>
              <Input_form
                form_structure={customer_form_structure} // passing the form structure
                update_object={update_object} // passing the update object
                type="customer"
                refresh={this.refresh} // handling refresh
              />
            </div>
          </div>

          <div className="table">
            <div className="first_table">
              <Table
                tableHead={customer_tableHead} // passing tablehead
                tableBody={customer_tableBody} // passing tablebody
                handleDelete={this.handleCustomerDelete} // handling delete operation
                handleEdit={this.handleCustomerEdit} // handling edit operation
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Customer;
