import React, {Component, Fragment} from 'react'
import * as Api from '../Lib/Api';

class Login extends Component {

  constructor() {
    super();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.state = {
      loginDenied: false
    };
  }



  onSubmit = e => {
    e.preventDefault(); // prevent refreshing the page
    const emailAddress = this.emailRef.current.value;
    const password = this.passwordRef.current.value;
    Api.login(emailAddress, password).then(
      result => {
        this.setState({
          loginDenied: !result
        });
        if (result) {
          this.props.loggedInAs(emailAddress);
        }
      }
    );
  }

  render() {
    return(
    <div>
      <form onSubmit={this.onSubmit}>
        Email address:<br/>
        <input type="text" ref={this.emailRef}/><br/>
        Password:<br/>
        <input type="password" ref={this.passwordRef}/>
        <input type="submit" value="Submit"/>
      </form>
      {(this.state.loginDenied
        ? <p>Login denied. Please try again.</p>
        : <Fragment/>)}
    </div>
    );
  }
}

export default Login;