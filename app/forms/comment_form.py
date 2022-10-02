from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length

class CommentForm(FlaskForm):
    body = StringField('body', validators=[DataRequired(), Length(max=255, message='Comments musbe shorter than 250 characters')])
    replyTo = IntegerField('reply_to')
