from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, WordGon, WordGonSession
from ..forms.wordgon_form import WordGonForm
from ..forms.wordgon_session_form import WordGonSessionForm
from datetime import date, datetime

wordgon_routes = Blueprint('wordgon',__name__)


@wordgon_routes.route('',methods=['POST'])
@login_required
def dev_create_wordgon():
    form = WordGonForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        puzzle = WordGon(
            letters=data['letters'],
            user_id=data['userId'],
            shape=data['shape'],
            num_attempts=data['num_attempts'],
            puzzle_day=date(*data['puzzleDay'].split(','))
            )
        db.session.add(puzzle)
        db.session.commit()

@wordgon_routes.route('')
@login_required
def all_wordgons():
    puzzles = WordGon.query.all()
    return {'puzzles':[puzzle.to_dict() for puzzle in puzzles]}

@wordgon_routes.route('/<int:id>')
@login_required
def one_wordgon(id):
    puzzle = WordGon.query.get(id)
    return puzzle and puzzle.to_dict()

@wordgon_routes.route('/<int:id>/sessions', methods=['POST'])
@login_required
def add_session(id):
    puzzle = WordGon.query.get(id)

    if puzzle is None:
        return {'errors':['Puzzle not found']}, 401

    new_session = WordGonSession(
        puzzle_id=id,
        user_id=current_user.id
    )
    db.session.add(new_session)
    db.session.commit()
    return new_session.to_dict()

@wordgon_routes.route('/<int:puzzleId>/sessions/<int:sessionId>', methods=['PUT'])
@login_required
def edit_session(puzzleId, sessionId):
    session = WordGonSession.query.get(sessionId)

    form = WordGonSessionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if session.puzzle_id is puzzleId and form.validate_on_submit():
        session.guesses = form.guesses.data
        session.num_guesses = form.numGuesses.data
        session.completed = form.completed.data
        db.session.commit()
        return session.to_dict()
