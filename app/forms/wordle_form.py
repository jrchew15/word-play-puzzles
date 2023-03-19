from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import Regexp

class WordleForm(FlaskForm):
    word = StringField('word', validators=[Regexp('[a-z]{5}',message='Guesses must be 5 letters')])
    isPuzzleDay = BooleanField('is_puzzle_day')
