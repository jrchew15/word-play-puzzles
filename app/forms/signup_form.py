from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def email_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')

# def themes(form, field):
#     allowed_themes = ['light', 'dark']
#     if not any([field.data is theme for theme in allowed_themes]):
#         raise ValidationError(f'The only allowed themes are {", ".join(allowed_themes)}')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

def image_extensions(form, field):
    file = field.data
    allowed_extensions = ['.png','.jpg','.jpeg','.tiff','.gif']
    if len(file) > 0 and not (file.startswith('http://') or file.startswith('https://')):
        raise ValidationError("Image url must begin with 'https://' or 'http://'")
    if len(file) > 0 and not any([file.endswith(ext) for ext in allowed_extensions]):
        raise ValidationError(f'The allowed image file extensions are {", ".join(allowed_extensions)}')

class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), Email(), email_exists])
    password = StringField('password', validators=[DataRequired(), Length(min=6, message='Password must be at least 6 characters long')])
    profilePicture = StringField('profile_picture', validators=[image_extensions])

class EditUserForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), Email(), email_exists])
    profilePicture = StringField('profile_picture', validators=[image_extensions])
