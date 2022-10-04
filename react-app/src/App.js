import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import UserSettings from './components/UserSettings';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SplashPage from './components/SplashPage';
import Puzzle from './components/WordGon/Puzzle';
import PuzzlesOfTheDay from './components/Carousels/PuzzlesOfTheDay';
import PuzzlesByDifficulty from './components/Carousels/PuzzlesByDifficulty';
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
      <NavBar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
      <div id='nav-spacer' />
      <div id='omni-container' onClick={() => setShowDropdown(false)}>
        <Switch>
          <Route path='/login' exact={true}>
            <LoginPage />
          </Route>
          <Route path='/sign-up' exact={true}>
            <SignUpPage />
          </Route>
          <ProtectedRoute path='/settings' exact>
            <UserSettings />
          </ProtectedRoute>
          <Route path='/wordgons/:wordgonId' exact>
            {/* <OneWordGon /> */}
            <Puzzle />
          </Route>
          <ProtectedRoute path='/' exact={true} >
            {currentUser?.id ? <>
              <PuzzlesOfTheDay />
              <PuzzlesByDifficulty difficulty={'easy'} />
              <PuzzlesByDifficulty difficulty={'medium'} />
              <PuzzlesByDifficulty difficulty={'hard'} />
            </> : <Redirect to='/welcome' />
            }
          </ProtectedRoute>
          <Route path='/welcome' exact>
            <SplashPage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
