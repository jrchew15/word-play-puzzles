from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, User
from ..forms.signup_form import EditUserForm
from .utils import validation_errors_to_error_messages

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
    return user.to_dict(total=True)

@user_routes.route('/<int:id>',methods=['PUT'])
@login_required
def edit_user(id):
    if current_user.id is not id:
        return {'errors': ['Unauthorized']}, 401
    form = EditUserForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        user = User.query.get(id)
        user.username = form.username.data
        user.email = form.email.data
        user.profile_picture = form.profilePicture.data
        db.session.commit()
        return user.to_dict(current=True)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
