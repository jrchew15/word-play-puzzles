from crypt import methods
from flask import Blueprint, request
from app.models import db, Word
import os
from ..forms.word_form import WordForm

word_routes = Blueprint('words', __name__)

@word_routes.route('/<word>')
def get_word(word):
    found = Word.query.filter(Word.word == word).first()
    return ({'word':word}, 200) if found else ({'key':os.environ.get('RAPIDAPI_KEY'),'host':os.environ.get('RAPIDAPI_HOST')}, 400)

@word_routes.route('', methods=['POST'])
def add_word():
    form = WordForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    word = form.word.data
    if form.validate_on_submit():
        new_word = Word(word=word, length=len(word))
        db.session.add(new_word)
        db.session.commit()
        return {'word':word}, 200
    return {'errors':['Unauthorized']}, 405
