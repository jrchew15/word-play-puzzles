from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    credential = field.data
    user = User.query.filter(User.email == credential or User.username == credential).first()
    if not user:
        raise ValidationError('Could not find user with provided credentials.')


def password_matches(form, field):
    # Checking if password matches
    password = field.data
    credential = form.data['credential']
    user = User.query.filter(User.email == credential or User.username == credential).first()
    if not user or not user.check_password(password):
        raise ValidationError('Could not find user with provided credentials.')


class LoginForm(FlaskForm):
    credential = StringField('credential', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[
                           DataRequired(), password_matches])
