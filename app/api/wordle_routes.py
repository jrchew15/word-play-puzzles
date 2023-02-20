from crypt import methods
from http.client import responses
from flask import Blueprint, request
from flask_login import login_required, current_user

from ..models import db, Wordle, WordleSession, User
from .utils import validation_errors_to_error_messages
from ..forms.wordle_session_form import WordleSessionForm
from datetime import date

wordle_routes = Blueprint('wordle',__name__)

@wordle_routes.route('/by_date/<req_date>')
def get_puzzle_by_date(req_date):
    req_day = [int(x) for x in req_date.split('-')]
    print('!!!!!!!!!!!!!!',req_day)
    puzzle = Wordle.query.filter(Wordle.puzzle_day == date(*req_day)).one_or_none()

    if puzzle is not None:
        return puzzle.to_dict()
    return {'errors':['Puzzle not found']}, 404

@wordle_routes.route('/random')
@login_required
def random_wordle():
    user = User.query.options(db.joinedload(WordleSession)).get(current_user.id)
    puzzle_ids = [session.wordle.id for session in user.wordle_sessions]
    all_wordles = Wordle.query.filter(Wordle.puzzle_day is None)
    wordle = None
    for puzzle in all_wordles:
        if puzzle.id not in puzzle_ids:
            wordle = puzzle
            break
    if not wordle:
        return {"errors":['No unopened wordles']},401
    return wordle.to_dict()

@wordle_routes.route('', methods=['POST'])
@login_required
def make_new_wordle():
    form = WordleSessionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_wordle = Wordle(word=form.newGuess.data)
        db.session.add(new_wordle)
        db.session.commit()
        return new_wordle.to_dict()

@wordle_routes.route('/word/<word>')
@login_required
def find_wordle_by_word(word):
    wordle = Wordle.query.filter(Wordle.word == word).one_or_none()
    return wordle.to_dict() if wordle else {"errors":["Wordle not found"]},404

@wordle_routes.route('/<id>')
def one_wordle(id):
    try:
        id = int(id)
    except:
        return {'errors':['puzzle id must be integer']}, 404

    puzzle = Wordle.query.get(id)
    if puzzle is not None:
        return puzzle and puzzle.to_dict()
    return {'errors':['Puzzle not found']},404

@wordle_routes.route('/<int:id>/sessions', methods=['POST'])
@login_required
def add_wordle_session(id):
    puzzle = Wordle.query.get(id)

    if puzzle is None:
        return {'errors':['Puzzle not found']}, 401

    new_session = WordleSession(
        puzzle_id=id,
        user_id=current_user.id
    )
    db.session.add(new_session)
    db.session.commit()
    return new_session.to_dict()

@wordle_routes.route('/<int:puzzleId>/sessions/current')
@login_required
def get_users_wordle_session(puzzleId):
    session = WordleSession.query.filter(db.and_(WordleSession.puzzle_id == puzzleId, WordleSession.user_id == current_user.id)).one_or_none()
    if session:
        return session.to_dict()
    return {'errors':['session not found']}, 404

@wordle_routes.route('/<int:puzzleId>/sessions/<int:sessionId>', methods=['PUT'])
@login_required
def edit_wordle_session(puzzleId, sessionId):
    # session = WordleSession.query.get(sessionId)
    session = WordleSession.query.options(db.joinedload(WordleSession.wordle)).get(sessionId)

    form = WordleSessionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if session.puzzle_id == puzzleId and form.validate_on_submit():
        session.guesses = (session.guesses + ',' + form.newGuess.data) if len(session.guesses) > 0 else form.newGuess.data
        session.num_guesses += 1
        if session.num_guesses >= 6 or session.wordle.word == form.newGuess.data:
            session.completed = True
        db.session.commit()
        return session.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@wordle_routes.route('/<int:puzzleId>/sessions/<int:sessionId>', methods=['DELETE'])
@login_required
def delete_wordle_session(puzzleId, sessionId):
    session = WordleSession.query.get(sessionId)

    if session.user_id is current_user.id:
        db.session.delete(session)
        db.session.commit()
        return {"message":"successfully deleted"}, 201
    return {"errors":["Unauthorized"]}, 405

@wordle_routes.route('/leaders')
def wordle_leaders():
    # stmt = db.select( WordleSession.user_id,db.func.count()).group_by(WordleSession.user_id).order_by(db.desc(db.func.count())).where(WordleSession.completed == True)
    stmt = db.select(WordleSession.user_id, db.func.count(), User.username, User.profile_picture, db.func.avg(WordleSession.num_guesses))\
        .join(User.wordle_sessions)\
        .group_by(WordleSession.user_id)\
        .order_by(db.desc(db.func.count()))\
        .where(WordleSession.completed == True)\
        .limit(3)
    top = db.session.execute(stmt).all()
    return {'leaders':[dict(x) for x in top]}
