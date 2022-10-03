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
import Puzzle from './components/WordGon/Puzzle';
import PuzzlesOfTheDay from './components/Carousels/PuzzlesOfTheDay';
import { authenticate } from './store/session';
import { thunkLoadWordgonSessions } from './store/wordgon';

import './index.css'

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false)

  const currentUser = useSelector(state => state.session.user)

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (currentUser && currentUser.id) {
        dispatch(thunkLoadWordgonSessions())
      }
    })()
  }, [currentUser])

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <div id='omni-container' onClick={() => setShowDropdown(false)}>
        <NavBar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
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
          <ProtectedRoute path='/wordgons' exact>
            <AllWordGons />
          </ProtectedRoute>
          <ProtectedRoute path='/wordgons/:wordgonId'>
            {/* <OneWordGon /> */}
            <Puzzle />
          </ProtectedRoute>
          <ProtectedRoute path='/' exact={true} >
            <h1>My Home Page</h1>
            <PuzzlesOfTheDay />
          </ProtectedRoute>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
