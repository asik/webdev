import React, {Component, Fragment} from 'react'
import * as Api from '../Lib/Api';

class Register extends Component {

  constructor() {
    super();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.repeatPasswordRef = React.createRef();
    this.state = {
      error: ""
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const emailAddress = this.emailRef.current.value;
    const password = this.passwordRef.current.value;
    const repeatPassword = this.repeatPasswordRef.current.value;
    
    if (emailAddress === "" || password === "" || repeatPassword === ""){
      this.setState({
        error: "Please fill out all fields."
      })
    }
    if (password !== repeatPassword) {
      this.setState({
        error: "Please enter matching passwords."
      });
    }
    else
    {
      Api
        .register(emailAddress, password)
        .then(_success => {
          this.props.registered();
        },
        error => {
          this.setState({
            error: error
          });
        })
    }
  }

  render() {
    return(
      <div>
        <form onSubmit={this.onSubmit}>
          Email address:<br/>
          <input type="text" ref={this.emailRef}/><br/>
          Password:<br/>
          <input type="password" ref={this.passwordRef}/><br/>
          Repeat password:<br/>
          <input type="password" ref={this.repeatPasswordRef}/><br/>
          <input type="submit" value="Submit"/>
        </form>
        {(this.state.error === ""
          ? <Fragment/>
          : <p>{this.state.error}</p>)}
      </div>
    );
  }
}

export default Register;