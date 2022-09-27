from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, Length

class WordGonForm(FlaskForm):
    userId = IntegerField('user_id', validators=[DataRequired()])
    puzzleId = IntegerField('puzzle_id', validators=[DataRequired()])
    guesses = StringField('guesses', default='')
    numGuesses = IntegerField('num_guesses', default=0)
    completed = BooleanField('completed', default=False)
