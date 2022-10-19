from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import Regexp

class WordleSessionForm(FlaskForm):
    newGuess = StringField('new_guess', validators=[Regexp('[a-z]{5}',message='Guesses must be 5 letters')])
