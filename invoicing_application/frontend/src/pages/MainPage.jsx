import React, { Component } from "react";
import Navbar from "../components/navbar/Navbar";
import Invoice from "./incvoice/Invoice";
import Customer from "./customer/Customer";
import Product from "./product/Product";
import './MainPage.scss'

class MainPage extends Component {
  state = {
    selected_item: "invoice", // storing the selected page to be shown, 'invoice is default'
  };

  // handling the page changes
  handlePageChange = (id) => {
    this.setState({ selected_item: id });
  };

  render() {
    const { selected_item } = this.state;

    let page;

    switch (this.state.selected_item) {// checking against the selected item and showing the page accordingly
      case "invoice":
        page = <Invoice />;
        break;
      case "product":
        page = <Product />;
        break;
      case "customer":
        page = <Customer />;
        break;
      default: 
        page = <Invoice />;
        break;
    }

    return (
      <div className="mainPage">
        <Navbar
          handlePageChange={this.handlePageChange}
          selected_item={selected_item}
        />
        <div className="content">
          {page}
        </div>
        
      </div>
    );
  }
}

export default MainPage;
