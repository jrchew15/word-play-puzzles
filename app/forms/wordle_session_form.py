from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import Length, Regexp

class WordleSessionForm(FlaskForm):
    newGuess = StringField('new_guess', validators=[Length(min=5,max=5,message="Guesses must be 5 letters"),Regexp('[a-z]{5}',message='Guesses must be 5 letters')])
