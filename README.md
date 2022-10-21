# [Word Play Puzzles](https://word-play-puzzles.herokuapp.com)

## A Particularly Playful Puzzle Platform
This application takes heavy inspiration from the New York Times Puzzles. In particular, Word Play offers a large collection of Word-Gon puzzles, modeled after the NYT's Letter Boxed.

You can enjoy the plethora of puzzles, organized by difficulty at:

https://word-play-puzzles.herokuapp.com

#

## Packages and Frameworks


### Backend
 - [Flask](https://flask.palletsprojects.com/)
 - [PostgreSQL](https://www.postgresql.org/)
 - [SQLAlchemy](https://www.sqlalchemy.org/)
 - [WTForms](https://wtforms.readthedocs.io/en/3.0.x/) and [Flask-WTForms](https://flask-wtf.readthedocs.io/en/1.0.x/)
### Frontend
 - [React](https://reactjs.org/)
 - [Redux](https://redux.js.org/)
 - [WordsAPI](https://www.wordsapi.com/)[*](#wordsAPI)

#

## MVP Features

### Users
 - New users can sign-up
 - Users can log in and log out
 - Users without an account can only access the puzzle of the day
 - Users with an account can update their information
### Word-Gon Puzzle Session
 - Logged in users can start a puzzle session by opening a specific puzzle
 - Once a user has started a session and before they have completed it, they can edit their guessed words
 - Once a user has completed a puzzle, it cannot be editted
 - Users can delete a session by starting over
### Comments
 - Logged in users can see all comments and create comments on a puzzle
 - Users can reply to comments which are not themselves replies
 - Users can edit their past comments
 - Users can delete their past comments

#

## API Routes

The backend API route documentation can be found [here](https://github.com/jrchew15/word-play-puzzles/wiki/API-Routes/).

#

## Application Highlights

### Home Page
The home page displays the puzzle of the day prominently, past puzzles of the day, and a randomized group of other puzzles sorted by difficulty.
![homepage](https://raw.githubusercontent.com/jrchew15/word-play-puzzles/main/documentation-images/wireframes/homepage-clean.png)

### Puzzle Display
The lines connecting letters update dynamically. These were constructed with only React and css, aided by simple calculations.

The entire display is constructed with relative units, making the component extremely flexible. The square is reused in the carousel lists and is simply resized.
![puzzlepage](https://raw.githubusercontent.com/jrchew15/word-play-puzzles/main/documentation-images/wireframes/puzzlepage-clean.png)

### Carousels
The carousels scroll smoothly using the left and right buttons. The buttons deactivate when at the respective far left and right of the list of puzzles.

Users can see which puzzles they have begun and completed from the display of lines depicting guesses and from the message on the bottom button of each card.
![carousel](https://raw.githubusercontent.com/jrchew15/word-play-puzzles/main/documentation-images/wireframes/carousel.png)


### Word Validation
A core requirement of presenting these puzzles is that the application must be able to confirm whether or not a user's submission is an existing English word. Here is an outline of the process:
 1. The user submits a word
 2. The flask backend receives the submission and checks the internal database's 'words' table which is populated with valid words.
 3. If the word is not found internally, the backend sends a request to the WordsAPI.
 4. If the external WordsAPI confirms that the submission is a word, the backend adds it to the internal database.[*](#wordsAPI)
 5. The frontend receives a response from the backend and either displays an error or adds the word to the used words of the puzzle

#

## Future Features
### User-Created Word-Gons
Word-Gons are defined by the 12 letters they use and their placement along the square. Functionality can be added to allow users to create and share their own Word-Gon puzzles.

Puzzles would be validated by requiring users to complete their own puzzles before they can be posted.

### More Puzzle Types
The process by which words are validated is applicable to nearly any word puzzle. In the future the application may also provide access to puzzles similar to Wordle and Spelling Bee.


#

<a name=
"wordsAPI"></a> *[WordsAPI](https://www.wordsapi.com) provides signifnificantly more information than is required by the internal database, including definitions, word frequency, and much more.
