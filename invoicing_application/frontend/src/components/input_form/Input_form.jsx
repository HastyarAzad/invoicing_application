import "./Input_form.scss";
import { Component } from "react";
import api from "../../services/api";

class Input_form extends Component {

  state = {
    inputs: {}, // this is where we store our inputs
    button_text: "", // button text can be "Submit" or "Update"
    button_color: "", // saving buttons collor, can be 'green' or 'pink'
    warning: false, // wether to show the warning or not
    warning_text: "", // warning text
  };

  constructor(props) {
    super(props);

    //setting up the initial values for our input fields
    this.props.form_structure.map((item) => {
      this.state.inputs[item.id] = "";
      return null;
    });
    this.state.button_text = "Submit"
  }

  // resetting all the fieds to ''
  resetFields = () => {
    let inputs;
    this.props.form_structure.map((item) => {
      inputs = this.state.inputs;
      inputs[item.id] = "";
      return null;
    });

    this.setState({ inputs, button_color:"", button_text:"Submit" });
  };

  // handling the input changes
  handleInputChange = (event) => {
    let inputs = this.state.inputs;
    if (event.target.type === "file") {
      inputs[event.target.id] = event.target.files[0];
    } else {
      inputs[event.target.id] = event.target.value;
    }

    this.setState({ inputs });
  };

  // handling the submit functionality
  handleSubmit = async (event) => {
    event.preventDefault(); // preventing default actions, 
    let s = "please fill in the following fields \n";
    let pass = true;
    for (const property in this.state.inputs) { // checking if all the inputs contain data?
      if (this.state.inputs[property] === "" && property !== "id") {
        s += `${property}\n`;
        pass = false;
      }
    }
    if (!pass) {
      alert(s);
      return;
    }

    const obj = { ...this.state.inputs };

    let formData = new FormData();

    for (const property in obj) {
      formData.append(`${property}`, obj[property]); // storing everything inside Formdata object
    }

    const result = await api.create(`${this.props.type}`, formData); // sending the data to the api

    this.setState({warning:true,warning_text:<div className="alert">{result.data}</div>}) // updating the states
    setTimeout(this.reset_timeout, 3000); // showing the warning for 3 seconds

    this.resetFields();
    this.props.refresh();
  };

  // hiding the warning message
  reset_timeout = () => {
    this.setState({ warning: false });
  };

  // here is where we handle our update process
  // we check against the states of our props and our update_object
  // if this is the form that needs to be updated, we set all the inputs values according to the update_object
  componentDidUpdate(previousProps) {
    if (this.props.type === this.props.update_object.type) {// checking if the update_object's type is the same as the input form type
      if (previousProps !== this.props) { 
        let inputs;
        this.props.form_structure.map((item, index) => {
          inputs = this.state.inputs;
          inputs[item.id] = this.props.update_object.value[index];
          return null;
        });

        this.setState({ inputs, button_color:"update", button_text:"update" });  // updating the state 
      }
    }
  }

  render() {
    const props = this.props;
    return (
      <div className="form_div">
        {this.state.warning ?  this.state.warning_text : ''} 
        <form action="/action_page.php" onSubmit={this.handleSubmit}>
          {props.form_structure.map((item, index) => {// based on the form structure, we create the form
            if (// checking if the type is text, number or date, we will render the same style accordingly
              item.type === "text" ||
              item.type === "number" ||
              item.type === "date"
            ) {
              let min = item.type === "number" ? { min: 0 } : ""; // if the type is number, add min: 0 attribute to it
              let disabled = item.id === "id" ? { disabled: "ture" } : {}; // if this is an id field, disable it ' ids should be generated, not given by user'
              return (
                <div className="element" key={index}>
                  <label htmlFor={item.id}>{item.name}</label>
                  <input
                    required
                    {...min}
                    {...disabled}
                    type={item.type}
                    id={item.id}
                    name={item.name}
                    placeholder={item.place_holder}
                    value={this.state.inputs[item.id]}
                    onChange={(event) => this.handleInputChange(event)} // rising an event to update the state
                  />
                </div>
              );
            } else if (item.type === "select") { // if type is sellect, create a selection dropdown
              return (
                <div className="element" key={index}>
                  <label htmlFor={item.id}>{item.name}</label>
                  <select
                    required
                    id={item.id}
                    name={item.name}
                    value={this.state.inputs[item.id]}
                    onChange={(event) => this.handleInputChange(event)} // rising an event to update the state
                  >
                    <option value={item.id} hidden>
                      select
                    </option>
                    {item.values.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              );
            } else if (item.type === "file") { // if the type is file, display a different item in the form
              return (
                <div className="element" key={index}>
                  <label htmlFor={item.id}>{item.name}</label>
                  <input
                    required
                    type={item.type}
                    id={item.id}
                    name={item.name}
                    placeholder={item.place_holder}
                    onChange={(event) => this.handleInputChange(event)}
                  />
                </div>
              );
            }else{
              return null;
            }
          })}
          <input type="reset" onClick={this.resetFields} value="Reset" /> 
          <input
            type="submit"
            value={this.state.button_text}
            className={this.state.button_color}
          />
        </form>
      </div>
    );
  }
}

export default Input_form;
