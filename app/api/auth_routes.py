from poplib import error_proto
from flask import Blueprint, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

from .utils import validation_errors_to_error_messages

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict(current=True)
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    print('------------------',form.data['credential'], form.validate_on_submit())
    if form.validate_on_submit():
        should_be=User.query.get(1)
        print('******************',should_be.email, form.data['credential'])
        # Add the user to the session, we are logged in!
        user = User.query.filter(db.or_(User.email == form.data['credential'], User.username == form.data['credential'])).first()
        login_user(user)
        return user.to_dict(current=True)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@auth_routes.route('/logout')
@login_required
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form['username'].data,
            email=form['email'].data,
            password=form['password'].data,
            profile_picture=form['profilePicture'].data
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict(current=True)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
