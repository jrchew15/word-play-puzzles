from flask import Blueprint, request
from flask_login import login_required, current_user

from ..models import db, WordGon, WordGonSession, Comment, User
from ..forms.comment_form import CommentForm
from ..forms.wordgon_form import WordGonForm
from ..forms.wordgon_session_form import WordGonSessionForm
from .utils import validation_errors_to_error_messages, db_date_to_datetime, not_future_day
from random import shuffle, sample

from datetime import date

wordgon_routes = Blueprint('wordgon',__name__)

@wordgon_routes.route('/by_date/<req_date>')
def get_puzzle_by_date(req_date):
    req_day = [int(x) for x in req_date.split('-')]
    puzzle = WordGon.query.filter(WordGon.puzzle_day == date(*req_day)).one()

    if puzzle is not None:
        return puzzle.to_dict()
    return {'errors':['Puzzle not found']}, 404

@wordgon_routes.route('/puzzles_of_the_day')
def get_puzzles_of_the_day():
    puzzles = WordGon.query.filter(WordGon.user_id == 1).order_by(WordGon.puzzle_day.desc()).all()
    return {'puzzles':[puzzle.to_dict() for puzzle in puzzles if not_future_day(puzzle.puzzle_day)]}

@wordgon_routes.route('/difficulty/<diff>')
@login_required
def get_puzzles_by_difficulty(diff):
    reader = {'easy':6,'medium':7}
    if diff == 'hard':
        puzzles = WordGon.query.filter(db.and_(WordGon.num_attempts >= 8, WordGon.puzzle_day == None))
    else:
        puzzles = WordGon.query.filter(db.and_(WordGon.num_attempts == reader[diff], WordGon.puzzle_day == None))
    puzzles_list = [puzzle.to_dict() for puzzle in puzzles]
    if len(puzzles_list) >= 30:
        puzzles_list = sample(puzzles_list, 30)
    else:
        shuffle(puzzles_list)
    return {'puzzles':puzzles_list}

@wordgon_routes.route('/<id>')
def one_wordgon(id):
    try:
        id = int(id)
    except:
        return {'errors':['puzzle id must be integer']}, 404

    puzzle = WordGon.query.get(id)
    if puzzle is not None:
        return puzzle and puzzle.to_dict()
    return {'errors':['Puzzle not found']},404

@wordgon_routes.route('/<int:id>/stats')
def include_wordgon_stats(id):
    puzzle = WordGon.query.get(id)
    stats = {}
    for session in puzzle.sessions:
        if session.completed and len(set(session.guesses)) == 13:
            stats[str(session.num_guesses)] = stats[str(session.num_guesses)] + 1 if str(session.num_guesses) in stats else 1
    if len(stats)>0:
        stats['average'] = round(sum(stats[key]*int(key) for key in stats)/sum(stats[key] for key in stats), 2)
    return stats

@wordgon_routes.route('/<int:id>/sessions', methods=['POST'])
@login_required
def add_session(id):
    puzzle = WordGon.query.get(id)

    if puzzle is None:
        return {'errors':['Puzzle not found']}, 404

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
    if session.puzzle_id == puzzleId and form.validate_on_submit():
        session.guesses = form.guesses.data
        session.num_guesses = form.numGuesses.data
        session.completed = form.completed.data
        db.session.commit()
        return session.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@wordgon_routes.route('/<int:puzzleId>/sessions/<int:sessionId>', methods=['DELETE'])
@login_required
def delete_session(puzzleId, sessionId):
    session = WordGonSession.query.get(sessionId)

    if session.user_id is current_user.id:
        db.session.delete(session)
        db.session.commit()
        return {"message":"successfully deleted"}, 201
    return {"errors":["Unauthorized"]}, 405

@wordgon_routes.route('/<int:puzzleId>/comments')
@login_required
def get_puzzle_comments(puzzleId):
    puzzle = WordGon.query.get(puzzleId)
    if puzzle is None:
        return {'errors':['Puzzle not found']}, 401
    comments = puzzle.comments

    return {
        "comments": {
            comment.id: comment.to_dict() for comment in comments
        }
    }

@wordgon_routes.route('/<int:puzzleId>/comments', methods=['POST'])
@login_required
def add_comment(puzzleId):
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        comment = Comment(
            puzzle_id=puzzleId,
            user_id=current_user.id,
            body=form.body.data,
            reply_to=form.replyTo.data or None
        )

        db.session.add(comment)
        db.session.commit()
        return comment.to_dict(), 201

    return {'errors':validation_errors_to_error_messages(form.errors)}, 401

@wordgon_routes.route('/leaders')
def wordgon_leaders():
    # top = WordGonSession.query.group_by(WordGonSession.user_id).all()
    stmt = db.select(WordGonSession.user_id, db.func.count(), User.username, User.profile_picture)\
        .join(User.sessions)\
        .group_by(WordGonSession.user_id)\
        .order_by(db.desc(db.func.count()))\
        .where(WordGonSession.completed == True)\
        .limit(3)
    top = db.session.execute(stmt).all()
    return {'leaders':[dict(x) for x in top]}
