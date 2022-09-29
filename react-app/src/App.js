import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import UserSettings from './components/UserSettings';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import AllWordGons from './components/WordGon/AllWordGons';
import OneWordGon from './components/WordGon/OneWordGon';
import Puzzle from './components/WordGon/Puzzle';
import User from './components/User';
import { authenticate } from './store/session';
import { thunkLoadWordgonSessions } from './store/wordgon';

import './index.css'

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.session.user)

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(thunkLoadWordgonSessions())
    }
  }, [currentUser])

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginPage />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpPage />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path='/settings' exact>
          <UserSettings />
        </ProtectedRoute>
        <Route path='/wordgons' exact>
          <AllWordGons />
        </Route>
        <Route path='/wordgons/:wordgonId'>
          {/* <OneWordGon /> */}
          <Puzzle />
        </Route>
        <ProtectedRoute path='/' exact={true} >
          <h1>My Home Page</h1>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
