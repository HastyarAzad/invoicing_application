import React from "react";
import "./Navbar.css";

const Navbar = (props) => {
  // getting the sellected nav-bar from the parent "Mainpage"
  const selected = props.selected_item;

  return (
    //returning a simpole navbar
    <div className="topnav">
      <a
        onClick={null}
        className="app_title"
        href="#invoiceing"
        style={{ cursor: "default" }}
      >
        Invoicing App
      </a>
      <a
        onClick={() => props.handlePageChange("invoice")}// hadling the page change
        href="#invoice"
        className={selected === "invoice" ? "a_hover selected" : "a_hover"}// adding selected class according to selected property
      >
        Invoice
      </a>
      <a
        onClick={() => props.handlePageChange("product")}// hadling the page change
        href="#product"
        className={selected === "product" ? "a_hover selected" : "a_hover"}// adding selected class according to selected property
      >
        Product
      </a>
      <a
        onClick={() => props.handlePageChange("customer")}// hadling the page change
        href="#customer"
        className={selected === "customer" ? "a_hover selected" : "a_hover"}// adding selected class according to selected property
      >
        Customer
      </a>
    </div>
  );
};

export default Navbar;
