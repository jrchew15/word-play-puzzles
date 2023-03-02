from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, User, WordleSession, WordGonSession, WordGon, Wordle
from ..forms.signup_form import EditUserForm
from .utils import validation_errors_to_error_messages
from .aws import get_unique_filename, allowed_file, upload_file_to_s3, delete_file_from_s3, ALLOWED_EXTENSIONS
import os

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    if user is not None:
        return user.to_dict(total=True)
    return {"errors":["Could not find user"]}

@user_routes.route('/<int:id>/wordle_stats')
@login_required
def user_wordle_stats(id):
    sessions=WordleSession.query\
        .join(WordleSession.wordle)\
        .add_column(Wordle.word)\
        .where(db.and_(WordleSession.user_id == id, WordleSession.completed == True)).all()
    stats={}
    for (session, word) in sessions:
        if session.completed and session.guesses.split(',')[-1]==word:
            stats[session.num_guesses] = stats[session.num_guesses]+1 if session.num_guesses in stats else 1
    stats['average'] = round(sum(stats[key]*key for key in stats)/sum(stats[key] for key in stats), 2) if len(stats) > 0 else 0
    return stats

@user_routes.route('/<int:id>/wordgon_stats')
@login_required
def user_wordgon_stats(id):
    stmt = db.select(db.func.count(WordGonSession.id),WordGon.num_attempts)\
        .join(WordGon.sessions)\
        .group_by(WordGon.num_attempts)\
        .where(db.and_(WordGonSession.user_id == id, WordGonSession.completed == True))
    stats = db.session.execute(stmt).all()
    body = {'total': 0}
    for x in stats:
        if x['num_attempts'] == 6:
            body['easy'] = x['count']
        if x['num_attempts'] == 7:
            body['medium'] = x['count']
        if x['num_attempts'] >= 8:
            body['hard'] = x['count']
        body['total'] += x['count']
    return body


@user_routes.route('/<int:id>',methods=['PUT'])
@login_required
def edit_user(id):
    if current_user.id is not id:
        return {'errors': ['Unauthorized']}, 401
    form = EditUserForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    repeat_username = User.query.filter(User.username == form.username.data)
    repeat_email = User.query.filter(User.email == form.email.data)

    errors = []

    if any([user.id is not id for user in repeat_username]):
        errors.append('The username is associated with another account')
    if any([user.id is not id for user in repeat_email]):
        errors.append('The email is associated with another account')

    profile_image = request.files['image']
    upload = None

    if profile_image:
        if not allowed_file(profile_image.filename):
            errors.append('Profile picture must be a '+', '.join(ALLOWED_EXTENSIONS))
        else:
            profile_image.filename = get_unique_filename(profile_image.filename)
            upload = upload_file_to_s3(profile_image)

            if 'url' not in upload:
                errors.append(upload['errors'])

    if len(errors) == 0 and form.validate_on_submit():
        user = User.query.get(id)
        user.username = form.username.data
        user.email = form.email.data

        old_image = user.profile_picture
        if profile_image:
            user.profile_picture = upload['url']
        db.session.commit()
        if profile_image and old_image.startswith(f'https://{os.environ.get("BUCKET_NAME")}'):
            message = delete_file_from_s3(key=old_image.split(sep='/')[-1])
            if 'errors' in message:
                errors.append(message['errors'])
        if len(errors) == 0:
            return user.to_dict(current=True)
    errors.extend(validation_errors_to_error_messages(form.errors))
    return {'errors': errors}, 401

@user_routes.route('/current/sessions')
@login_required
def get_user_sessions():
    return {session.id: session.to_dict() for session in current_user.sessions}
