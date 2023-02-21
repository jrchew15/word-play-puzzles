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
import Homepage from './Homepage';
import User from './components/User';
import BadRoute from './components/BadRoute';
import { authenticate } from './store/session';
import { thunkLoadWordgonSessions } from './store/wordgon';
import UnregisteredPuzzle from './components/WordGon/UnregisteredPuzzle';
import SignUpPrompt from './components/auth/SignUpPrompt';
import WordleTodayRedirect from './components/Carousels/WordleTodayRedirect';
import WordlePuzzle from './components/Wordle/WordlePuzzle';

import './index.css'

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showDeveloperDropdown, setShowDeveloperDropdown] = useState(false)
  const [triggerReload, setTriggerReload] = useState(false)

  const currentUser = useSelector(state => state.session.user)

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
    if (triggerReload) setTriggerReload(false)
  }, [dispatch, triggerReload]);

  useEffect(() => {
    (async () => {
      if (currentUser && currentUser.id) {
        dispatch(thunkLoadWordgonSessions())
      }
    })()
  }, [currentUser, dispatch])

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar showUserDropdown={showUserDropdown} setShowUserDropdown={setShowUserDropdown} showDeveloperDropdown={showDeveloperDropdown} setShowDeveloperDropdown={setShowDeveloperDropdown} setTriggerReload={setTriggerReload} />
      <div id='nav-spacer' />
      {!triggerReload && <div id='omni-container' onClick={() => { setShowUserDropdown(false); setShowDeveloperDropdown(false) }}>
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
            {currentUser ?
              <Puzzle /> :
              <UnregisteredPuzzle />
            }
          </Route>
          <Route path='/wordles/today' exact>
            <WordleTodayRedirect />
          </Route>
          <Route path='/wordles/:wordleId' exact>
            {currentUser && <WordlePuzzle />}
          </Route>
          <Route path='/' exact={true} >
            {currentUser ? <Homepage /> : <Redirect to='/welcome' />}
          </Route>
          <Route path='/welcome' exact>
            <SplashPage />
          </Route>
          <Route path='/user/:userId' exact>
            <User />
          </Route>
          <Route path='/unauthorized' exact>
            <SignUpPrompt />
          </Route>
          <Route path='/'>
            <BadRoute />
          </Route>
        </Switch>
      </div>}
    </BrowserRouter>
  );
}

export default App;
