import React from "react";
import "./Table.scss";

const Table = (props) => {
  const table = props.tableBody.map((item, index) => { // creating the table body
    return (
      <li key={index} className="table-row">
        {item.value.map((item, index) => { // creating the data elements inside each row
          return (
            <div key={index} className="col">
              <div className="data">{item}</div>
            </div>
          );
        })}
        <div className="col">
          <div className="btns">
            <button
              onClick={() => props.handleDelete(item.id,item.value[0])} // item.id is table id,  item.value[0] is database id
              className="button delete_btn"
            >
              delete
            </button>
          </div>
          <div className="btns">
            <button
              onClick={() => props.handleEdit(item.id,item.value[0])} // item.id is table id,  item.value[0] is database id
              className="button edit_btn"
            >
              Edit
            </button>
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className="container">
      <ul className="responsive-table">
        <li className="table-header">
          {props.tableHead.map((item) => ( // creating the table head
            <div key={item} className="col">
              <div className="data">{item}</div>
            </div>
          ))}
          <div className="col">
            <div className="data"></div>
          </div>
        </li>
        {table}
      </ul>
    </div>
  );
};

export default Table;
