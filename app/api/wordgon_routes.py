from flask import Blueprint
from flask_login import login_required
from ..models import db, WordGon
from ..forms.wordgon_form import WordGonForm
from datetime import date

wordgon_routes = Blueprint('wordgon',__name__)


@wordgon_routes.route('',methods=['POST'])
@login_required
def dev_create_wordgon():
    form = WordGonForm()
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
    return puzzle.to_dict()
