import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

// prevents access to users not signed in
const ProtectedRoute = props => {
  const user = useSelector(state => state.session.user)
  return (
    <Route {...props}>
      {(user) ? props.children : <Redirect to='/unauthorized' />}
    </Route>
  )
};


export default ProtectedRoute;
