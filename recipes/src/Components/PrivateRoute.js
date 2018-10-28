import React from 'react';
import {Route, Redirect} from 'react-router';

const PrivateRoute = ({component, isAuthenticated, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated 
        ? (<component {...props} />) 
        : (<Redirect to={{ pathname: "/login", state: { from: props.location }}}/>) 
    }
  />
); 

export default PrivateRoute;