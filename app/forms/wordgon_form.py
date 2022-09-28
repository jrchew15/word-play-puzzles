from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField
from wtforms.validators import DataRequired, ValidationError, Length

def allowed_shapes(form, field):
    shapes = ['square', 'trapezoid', 'pentagon']
    if not any([field.data is shape for shape in shapes]):
        raise ValidationError(f'The allowed shapes are {", ".join(shapes)}')

class WordGonForm(FlaskForm):
    letters = StringField('letters', validators = [Length(min=10, max=12), DataRequired()])
    userId = IntegerField('userId', validators = [DataRequired()])
    shape = StringField('shape', validators = [allowed_shapes])
    numAttempts = IntegerField('number_attempts', validators = [DataRequired()])
    puzzleDay = StringField('puzzle_day')
